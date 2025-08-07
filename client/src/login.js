import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate, useNavigate, useNavigation } from "react-router-dom";
import styles from "./Login.module.css";

function Login(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  // State for user feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Firebase authentication function
  const loginUser = async (email, password) => {
    try {
      // Use Firebase Auth to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Firebase login successful:", user);

      return {
        success: true,
        user: {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        },
        token: await user.getIdToken(), // Get Firebase JWT token
      };
    } catch (error) {
      console.error("Firebase login error:", error);

      // Handle specific Firebase auth errors
      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Clear previous messages and set loading
      setErrorMessage("");
      setSuccessMessage("");
      setIsLoading(true);

      const result = await loginUser(data.email, data.password);
      console.log("Login successful:", result);

      // Show success message
      setSuccessMessage("Login successful! Redirecting...");

      // Store Firebase token and user data
      if (result.token) {
        localStorage.setItem("firebaseToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Optional: Redirect after delay
      setTimeout(() => {
        // You can add navigation logic here
        console.log("Redirecting to map...");
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Login</h3>

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.inputGroup}>
          <input
            {...register("email", { required: true })}
            placeholder="Email"
            className={styles.input}
          />
          {errors.email && (
            <span className={styles.errorText}>Email is required</span>
          )}
        </div>

        <div className={styles.passwordContainer}>
          <input
            {...register("password", { required: true })}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className={styles.passwordInput}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.toggleButton}
          >
            {showPassword ? (
              // Eye slash icon (password hidden)
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon (password visible)
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          {errors.password && (
            <span className={styles.errorText}>Password is required</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className={styles.registerButton}
        >
          Don't have an account? Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            if (props.onCreateGuest) {
              props.onCreateGuest();
              navigate("/");
            }
          }}
          className="guest-button"
        >
          Continue as Guest
        </button>
      </form>
    </div>
  );
}

export default Login;
