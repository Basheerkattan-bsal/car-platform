const mongoose = require('mongoose');
const Service = require('../models/Service');

exports.getServicePublic = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, price, durationMinutes } = req.body;

    if (!title || price === undefined || durationMinutes === undefined) {
      return res.status(404).json({
        success: false,
        message: 'title, price, and duration are required',
      });
    }

    const created = await Service.create({
      title,
      description,
      price,
      durationMinutes,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
