import Auth from "./Auth";

function Login(props) {

  return (
    <Auth
      name="login"
      onSubmit={props.onLogin}
      title="Вход"
      buttonName="Войти"
    >
    </Auth>
  );
}

export default Login;