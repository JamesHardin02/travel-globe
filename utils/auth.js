// middleware to verify whether a user is logged in or not
const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    // redirect to login page
    res.status(400).json({message: "User is not logged in!"})
  } else {
    next();
  }
};

module.exports = withAuth;
