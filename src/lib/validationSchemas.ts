/**
 * Zod validation schemas for form data
 * Used to validate user input before sending to the database
 */
import { z } from 'zod';

// ===== Patient Schemas =====
export const patientSchema = z.object({
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  address: z.string().max(500, 'Address must be less than 500 characters').optional().or(z.literal('')),
  city: z.string().max(100, 'City must be less than 100 characters').optional().or(z.literal('')),
  country: z.string().max(100, 'Country must be less than 100 characters').optional().or(z.literal('Nepal')),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
  medical_history: z.string().max(5000, 'Medical history must be less than 5000 characters').optional().or(z.literal('')),
  allergies: z.string().max(500, 'Allergies must be less than 500 characters').optional().or(z.literal('')),
  emergency_contact_name: z.string().max(100, 'Name must be less than 100 characters').optional().or(z.literal('')),
  emergency_contact_phone: z.string().max(20, 'Phone must be less than 20 characters').optional().or(z.literal('')),
  is_international: z.boolean().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// ===== Appointment Schemas =====
export const appointmentSchema = z.object({
  patient_id: z.string().uuid('Please select a patient'),
  appointment_date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  treatment_type: z.string().min(1, 'Treatment type is required'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().or(z.literal('')),
}).refine((data) => data.start_time < data.end_time, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ===== Invoice Schemas =====
export const invoiceItemSchema = z.object({
  treatment_id: z.string().optional().or(z.literal('')),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity must be less than 10,000'),
  unit_price: z.number()
    .min(0, 'Price cannot be negative')
    .max(10000000, 'Price must be less than 10,000,000'),
});

export const invoiceSchema = z.object({
  patient_id: z.string().uuid('Please select a patient'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discount: z.number()
    .min(0, 'Discount cannot be negative')
    .max(10000000, 'Discount must be less than 10,000,000'),
});

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// ===== Payment Schema =====
export const paymentSchema = z.object({
  amount: z.number()
    .positive('Payment amount must be positive')
    .max(100000000, 'Amount must be less than 100,000,000'),
  payment_method: z.enum(['cash', 'card', 'bank', 'online']),
  reference_number: z.string().max(100, 'Reference must be less than 100 characters').optional().or(z.literal('')),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// ===== Inventory Schema =====
export const inventoryItemSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters')
    .trim(),
  sku: z.string().max(50, 'SKU must be less than 50 characters').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
  category_id: z.string().optional().or(z.literal('')),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  min_stock_level: z.number()
    .int('Min stock must be a whole number')
    .min(0, 'Min stock cannot be negative'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit must be less than 20 characters'),
  cost_price: z.number()
    .min(0, 'Cost price cannot be negative')
    .max(10000000, 'Cost price must be less than 10,000,000')
    .optional()
    .nullable(),
  supplier: z.string().max(200, 'Supplier must be less than 200 characters').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional().or(z.literal('')),
  expiry_date: z.string().optional().or(z.literal('')),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

// ===== User Management Schema =====
export const newUserSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  role: z.enum(['super_admin', 'admin', 'manager', 'receptionist', 'dentist', 'content_editor']),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional().or(z.literal('')),
});

export const editUserSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  role: z.enum(['super_admin', 'admin', 'manager', 'receptionist', 'dentist', 'content_editor']),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional().or(z.literal('')),
});

export type NewUserFormData = z.infer<typeof newUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;

/**
 * Helper to get validation error message
 */
export function getValidationError(result: z.SafeParseReturnType<unknown, unknown>): string | null {
  if (result.success) return null;
  return result.error.errors[0]?.message || 'Validation failed';
}
