import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

const uzbekFirstNames = [
  'Ali',
  'Madina',
  'Azizbek',
  'Dilshod',
  'Malika',
  'Jasur',
  'Sevinch',
  'Muhammad',
  'Zarina',
  'Sardor',
  'Gulnoza',
  'Bekzod',
  'Mohira',
  'Islom',
  'Shahzoda',
]

const uzbekLastNames = [
  'Valiyev',
  'Karimova',
  'Toshpulatov',
  'Rahimova',
  'Abdullayev',
  'Ergasheva',
  'Saidov',
  'Yusupova',
  'Nazarov',
  'Qodirova',
]

export const users = Array.from({ length: 500 }, (_, index) => {
  const firstName = uzbekFirstNames[index % uzbekFirstNames.length]
  const lastName = uzbekLastNames[index % uzbekLastNames.length]
  const phone = `+998 ${90 + (index % 9)} ${String(1000000 + index).padStart(7, '0')}`
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: `${firstName}.${lastName}.${index + 1}`.toLocaleLowerCase(),
    email: `${firstName}.${lastName}.${index + 1}@sfera.uz`.toLocaleLowerCase(),
    phoneNumber: phone,
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
    ]),
    role: faker.helpers.arrayElement([
      'superadmin',
      'manager',
      'teacher',
      'finance',
      'student',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
