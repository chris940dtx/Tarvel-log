const { Router } = require("express");
const router = Router();
const admin = require("../firebase-admin");

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    //verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
     
    //put user info into request obj
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next(); 
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
};

// POST /api/auth/verify - Verify Firebase token
router.post("/verify", async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Token is required" 
      });
    }
    
    //wait until the token is received
    const decodedToken= await admin.auth().verifyIdToken(token);
    
    res.json({ 
      success: true, 
      message: "Token verified",
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email
      }
    });
    
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during token verification" 
    });
  }
});

// GET /api/auth/me - Get current user info (protected route)
router.get("/me", verifyFirebaseToken, async (req, res, next) => {
  try {
    // User is already verified by middleware
    
    res.json({ 
      success: true, 
      message: "User info retrieved",
      user: req.user
    });
    
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

module.exports = {router, verifyFirebaseToken};