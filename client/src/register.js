import { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register(props) {
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

  // Firebase registration function
  const registerUser = async (email, password, firstName, lastName) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      console.log("Firebase registration successful:", user);

      return {
        success: true,
        user: {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        },
        token: await user.getIdToken(),
      };
    } catch (error) {
      console.error("Firebase registration error:", error);

      // Handle specific Firebase auth errors
      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
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

      const result = await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );

      console.log("Registration successful:", result);

      // Show success message
      setSuccessMessage("Registration successful! Redirecting to login...");

      // Store Firebase token and user data
      if (result.token) {
        localStorage.setItem("firebaseToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      setTimeout(() => {
        console.log("Redirecting to map...");
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Sign Up</h3>

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              color: "red",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#ffe6e6",
              borderRadius: "4px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div
            style={{
              color: "green",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#e6ffe6",
              borderRadius: "4px",
            }}
          >
            {successMessage}
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <input
            {...register("firstName", { required: true })}
            placeholder="First Name"
            style={{ width: "100%", padding: "10px", marginBottom: "5px" }}
          />
          {errors.firstName && (
            <span style={{ color: "red", fontSize: "12px" }}>
              First name is required
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            {...register("lastName", { required: true })}
            placeholder="Last Name"
            style={{ width: "100%", padding: "10px", marginBottom: "5px" }}
          />
          {errors.lastName && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Last name is required
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            {...register("email", { required: true })}
            placeholder="Email"
            style={{ width: "100%", padding: "10px", marginBottom: "5px" }}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Email is required
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            {...register("password", { required: true, minLength: 6 })}
            placeholder="Password"
            type="password"
            style={{ width: "100%", padding: "10px", marginBottom: "5px" }}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.password.type === "required"
                ? "Password is required"
                : "Password must be at least 6 characters"}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isLoading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Already have an account? Login
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

export default Register;
