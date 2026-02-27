export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    me: '/auth/me',
  },
  cars: {
    list: '/cars',
    brands: '/cars/meta/brands',
    byId: (id: string) => `/cars/${id}`,
    uploadImage: (id: string) => `/cars/${id}/images`,
    setMainImage: (id: string) => `/cars/${id}/main-image`,
    deleteImage: (id: string) => `/cars/${id}/images`,
  },
  services: {
    list: '/services',
  },
  bookings: {
    create: '/bookings',
    my: '/bookings/me',
  },
  admin: {
    stats: '/admin/stats',
    cars: '/admin/cars',
    unpublishCar: (id: string) => `/admin/bookings/${id}/unpublish`,
    dealers: '/admin/dealers',
    bookings: '/admin/bookings',
    approveBooking: (id: string) => `/admin/bookings/${id}/approve`,
    cancelBooking: (id: string) => `/admin/bookings/${id}/cancel`,
  },
  dealersCars: {
    my: '/dealer/cars/me',
    create: '/dealer/cars',
    byId: (id: string) => `/dealer/cars/${id}`,
    publish: (id: string) => `/dealer/cars{id}/publish`,
    unpublish: (id: string) => `/dealer/cars/${id}/unpublish`,
    uploadImage: (id: string) => `/dealer/cars/${id}/images`,
    mainImage: (id: string) => `/dealer/cars/${id}/main-image`,
  },
} as const;
