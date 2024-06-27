import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Oturum bilgilerini temizle (örneğin, localStorage veya sessionStorage)
    localStorage.removeItem('token');
    // Giriş sayfasına yönlendirme
    navigate('/login');
  };

  return logout;
};

export default useLogout;
