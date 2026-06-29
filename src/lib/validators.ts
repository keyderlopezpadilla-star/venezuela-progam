import { z } from 'zod';

/** Validador para donaciones. */
export const donationSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Monto inválido' })
    .positive('El monto debe ser positivo')
    .max(1_000_000, 'El monto excede el límite permitido'),
  currency: z.string().length(3).default('USD'),
  type: z.enum(['ONE_TIME', 'RECURRING', 'CORPORATE', 'IN_KIND', 'ANONYMOUS']),
  campaignId: z.string().optional().nullable(),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(500).optional(),
  donorName: z.string().min(2).max(120).optional(),
  donorEmail: z.string().email('Email inválido').optional(),
  donorPhone: z.string().min(7).max(20).optional(),
  coverFees: z.boolean().default(false),
});

export type DonationInput = z.infer<typeof donationSchema>;

export const helpRequestSchema = z.object({
  fullName: z.string().min(2, 'Nombre muy corto').max(120),
  phone: z.string().min(7, 'Teléfono inválido'),
  email: z.string().email().optional().or(z.literal('')).transform((v) => v || undefined),
  region: z.string().min(2),
  city: z.string().min(2),
  address: z.string().max(250).optional(),
  familySize: z.number().int().min(1).max(50),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.enum([
    'FOOD',
    'WATER',
    'MEDICINE',
    'CLOTHING',
    'SHELTER',
    'OTHER',
  ]),
  description: z.string().min(10, 'Cuéntanos más sobre tu situación').max(2000),
  hasChildren: z.boolean().default(false),
  hasElderly: z.boolean().default(false),
  hasDisabled: z.boolean().default(false),
  consent: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar el consentimiento' }) }),
});

export type HelpRequest = z.infer<typeof helpRequestSchema>;

export const volunteerSchema = z.object({
  bio: z.string().min(20, 'Cuéntanos un poco sobre ti').max(1000),
  skills: z.array(z.string()).min(1, 'Selecciona al menos una habilidad'),
  availability: z.string().min(2),
  hasVehicle: z.boolean().default(false),
  languages: z.array(z.string()).min(1),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default('Venezuela'),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar la verificación' }) }),
});

export type Volunteer = z.infer<typeof volunteerSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(4),
  message: z.string().min(10).max(2000),
});

export const registerSchema = z
  .object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(128),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Acepta los términos' }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
