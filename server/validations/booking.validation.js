const { z } = require('zod');

exports.createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1),
    scheduledAt: z.string().min(1),
    note: z.string().max(300).optional(),
  }),

  query: z.object({}),
  params: z.object({}),
});
