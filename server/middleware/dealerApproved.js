exports.dealerApproved = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();

    const dealerProfile = await dealerProfile.findOne({ user: req.user.id });

    if (!dealerProfile) {
      return res.status(403).json({
        message: 'Dealer not found',
      });
    }
    if (dealerProfile.status !== 'approved') {
      return res.status(403).json({ message: 'Dealer is not approved' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
