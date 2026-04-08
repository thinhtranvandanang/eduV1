import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Database features will not work.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit', // Chuyển sang implicit để tránh lỗi PKCE verifier
      storageKey: 'eduai-supabase-auth',
      storage: window.localStorage
    }
  }
);

export const loginWithGoogle = async (): Promise<User> => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: 'select_account'
      }
    }
  });

  if (error) throw error;
  if (!data.url) throw new Error("No auth URL returned");

  const authWindow = window.open(
    data.url,
    'supabase_oauth_popup',
    'width=600,height=700'
  );

  if (!authWindow) {
    throw new Error("Popup blocked. Please allow popups for this site.");
  }

  return new Promise((resolve, reject) => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SUPABASE_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        
        try {
          const url = new URL(event.data.url);
          const code = url.searchParams.get('code');
          
          if (code) {
            // Trường hợp PKCE (mặc định của Supabase hiện nay)
            const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
            if (sessionError) throw sessionError;
            if (sessionData.user) resolve(sessionData.user);
            else throw new Error("Không tìm thấy thông tin người dùng");
          } else {
            // Trường hợp Implicit (Token nằm trong dấu #)
            const hash = url.hash;
            if (hash) {
              const params = new URLSearchParams(hash.substring(1));
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');
              
              if (accessToken && refreshToken) {
                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                if (sessionError) throw sessionError;
                if (sessionData.user) resolve(sessionData.user);
                else throw new Error("Không tìm thấy thông tin người dùng");
              } else {
                throw new Error("Không tìm thấy token trong phản hồi");
              }
            } else {
              throw new Error("Phản hồi từ Google không hợp lệ");
            }
          }
        } catch (err) {
          reject(err);
        }
      }
    };
    window.addEventListener('message', handleMessage);
  });
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
