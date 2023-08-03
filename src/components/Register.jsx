import { Link } from "react-router-dom";
import Auth from "./Auth";

function Register(props) {

  return (
    <Auth
    name="register"
    onSubmit={props.onRegister}
    title="Регистрация"
    buttonName="Зарегистрироваться"
    >
    <Link to="/sign-in" className="authentication__enter">{"Уже зарегистрированы? Войти"}</Link>
    </Auth>
  );
}

export default Register;