const { z } = require('zod');

const createCarSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  price: z.number().positive('Price must be positive'),
  brand: z.string().trim().min(1, 'Brand is required'),
  year: z
    .number()
    .int()
    .min(1900, 'Year is invalid')
    .max(new Date().getFullYear() + 1, 'Year is invalid'),
  mileage: z.number().int().nonnegative('Mileage cannot be negative'),
  owner: z.enum(['Dealer', 'Private']),
  condition: z.enum(['Smoker', 'Non-Smoker']),
});

const updateCarSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .optional(),
    price: z.number().positive('Price must be positive').optional(),
    brand: z.string().trim().min(1, 'Brand is required').optional(),
    year: z
      .number()
      .int()
      .max(new Date().getFullYear() + 1, 'Year is invalid')
      .optional(),
    mileage: z
      .number()
      .int()
      .nonnegative('Mileage cannot b negative')
      .optional(),
    owner: z.enum(['Dealer', 'Private']).optional(),
    condition: z.enum(['Smoker', 'Non-Smoker']),
  })
  .strict();

module.exports = {
  createCarSchema,
  updateCarSchema,
};
