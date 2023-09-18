// Googleboton.js
import { GoogleLogin } from 'react-google-login';

const client_id = "19180977390-3r61h20l5259p9rdnfe8p0mv1500aicv.apps.googleusercontent.com";

function GoogleAuth() {
    const onSuccess = (res) => {
        console.log("Login con Éxito! Usuario:", res.profileObj);
    }

    const onFailure = (res) => {
        console.log("Algo fue mal! Usuario:", res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={client_id}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
}

export default GoogleAuth;
