export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  })),
};