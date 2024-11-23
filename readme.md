## Trip planner

### env guide

- PORT=8080
- DATABASE="mysql://u:pw@localhost:3306/trip_project"
- JWT_SECRET

- CLOUNDINARY_NAME
- CLOUNDINARY_API_KEY
- CLOUNDINARY_API_SECRET

---

### service

### 1. Authentication [x]

| Method | Path             | Description | Request Body                                               | Params | Query | Authen | Response                              |
| ------ | ---------------- | ----------- | ---------------------------------------------------------- | ------ | ----- | ------ | ------------------------------------- |
| POST   | `/auth/register` | สมัครสมาชิก | `{ "username": "...", "email": "...", "password": "..." }` | -      | -     | ✖      | `{ "token": "...", "user": { ... } }` |
| POST   | `/auth/login`    | เข้าสู่ระบบ | `{ "email": "...", "password": "..." }`                    | -      | -     | ✖      | `{ "token": "...", "user": { ... } }` |

### 2. User [x]

| Method | Path                   | Description              | Request Body                                                 | Params    | Query | Authen | Response               |
| ------ | ---------------------- | ------------------------ | ------------------------------------------------------------ | --------- | ----- | ------ | ---------------------- |
| GET    | `/users/me`            | ดูข้อมูลผู้ใช้ที่ล็อกอิน | -                                                            | -         | -     | ✔      | `{ "user": { ... } }`  |
| PUT    | `/users/me`            | แก้ไขข้อมูลส่วนตัวผู้ใช้ | `{ "username": "...", "email": "...", "profilePic": "..." }` | -         | -     | ✔      | `{ "user": { ... } }`  |
| GET    | `/users/:userId/trips` | ดูทริปทั้งหมดของผู้ใช้   | -                                                            | `:userId` | -     | ✔      | `{ "trips": [ ... ] }` |

### 3. Trip [x]

| Method | Path                   | Description      | Request Body                                                          | Params    | Query | Authen | Response                        |
| ------ | ---------------------- | ---------------- | --------------------------------------------------------------------- | --------- | ----- | ------ | ------------------------------- |
| POST   | `/trips`               | สร้างทริปใหม่    | `{ "name": "...", "destination": "...", "days": ..., "people": ... }` | -         | -     | ✔      | `{ "trip": { ... } }`           |
| GET    | `/trips/:tripId`       | ดูรายละเอียดทริป | -                                                                     | `:tripId` | -     | ✔      | `{ "trip": { ... } }`           |
| PUT    | `/trips/:tripId`       | แก้ไขทริป        | `{ "name": "...", "people": ... }`                                    | `:tripId` | -     | ✔      | `{ "trip": { ... } }`           |
| DELETE | `/trips/:tripId`       | ลบทริป           | -                                                                     | `:tripId` | -     | ✔      | `{ "message": "Trip deleted" }` |
| POST   | `/trips/:tripId/clone` | คัดลอกทริป       | -                                                                     | `:tripId` | -     | ✔      | `{ "trip": { ... } }`           |
| POST   | `/trips/:tripId/share` | แชร์ทริป         | -                                                                     | `:tripId` | -     | ✔      | `{ "message": "Trip shared" }`  |

### 4. Place []

| Method | Path                                            | Description                   | Request Body           | Params                             | Query                                              | Authen | Response                |
| ------ | ----------------------------------------------- | ----------------------------- | ---------------------- | ---------------------------------- | -------------------------------------------------- | ------ | ----------------------- |
| GET    | `/places`                                       | ดูสถานที่ตามจุดหมายและประเภท  | -                      | -                                  | `destination=:destinationId`, `category=:category` | ✖      | `{ "places": [ ... ] }` |
| POST   | `/trips/:tripId/days/:dayIndex/places`          | เพิ่มสถานที่ในแต่ละวันของทริป | `{ "placeId": "..." }` | `:tripId`, `:dayIndex`             | -                                                  | ✔      | `{ "day": { ... } }`    |
| DELETE | `/trips/:tripId/days/:dayIndex/places/:placeId` | ลบสถานที่จากทริป              | -                      | `:tripId`, `:dayIndex`, `:placeId` | -                                                  | ✔      | `{ "day": { ... } }`    |

### 5. Admin [x]

| Method | Path                     | Description                   | Request Body                                                                                         | Params     | Query | Authen | Response                         |
| ------ | ------------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------- | ---------- | ----- | ------ | -------------------------------- |
| GET    | `/admin/places`          | ดูสถานที่ทั้งหมด              | -                                                                                                    | -          | -     | ✔      | `{ "places": [ ... ] }`          |
| GET    | `/admin/places/count`    | ดูจำนวนสถานที่ทั้งหมด         | -                                                                                                    | -          | -     | ✔      | `{ "places": [ ... ] }`          |
| POST   | `/admin/places`          | เพิ่มสถานที่ใหม่              | `{ "name": "...", "category": "...", "location": { "lat": ..., "lng": ... }, "description": "..." }` | -          | -     | ✔      | `{ "place": { ... } }`           |
| PUT    | `/admin/places/:placeId` | แก้ไขข้อมูลสถานที่            | `{ "name": "...", "category": "...", "location": { "lat": ..., "lng": ... }, "description": "..." }` | `:placeId` | -     | ✔      | `{ "place": { ... } }`           |
| DELETE | `/admin/places/:placeId` | ลบสถานที่                     | -                                                                                                    | `:placeId` | -     | ✔      | `{ "message": "Place deleted" }` |
| GET    | `/admin/users`           | ดูรายชื่อผู้ใช้งานทั้งหมด     | -                                                                                                    | -          | -     | ✔      | `{ "users": [ ... ] }`           |
| GET    | `/admin/users/count`     | ดูจำนวนผู้ใช้งานทั้งหมด       | -                                                                                                    | -          | -     | ✔      | `{ "users": [ ... ] }`           |
| PUT    | `/admin/users`           | แก้ role ของผู้ใช้งาน         | -                                                                                                    | `:userId`  | -     | ✔      | `{ "users": [ ... ] }`           |
| DELETE | `/admin/users`           | ลบรายชื่อผู้ใช้งาน            | -                                                                                                    | `:userId`  | -     | ✔      | `{ "users": [ ... ] }`           |
| GET    | `/admin/trips`           | ดูทริปทั้งหมดในระบบ           | -                                                                                                    | -          | -     | ✔      | `{ "trips": [ ... ] }`           |
| GET    | `/admin/trips/count`     | ดูจำนวนทริปทั้งหมดในระบบ      | -                                                                                                    | -          | -     | ✔      | `{ "trips": [ ... ] }`           |
| GET    | `/admin/categories`      | ดูcategoryทั้งหมดในระบบ       | -                                                                                                    | -          | -     | ✔      | `{ "trips": [ ... ] }`           |
| GET    | `/admin/destinations`    | ดูจุดหมายปลายทางทั้งหมดในระบบ | -                                                                                                    | -          | -     | ✔      | `{ "trips": [ ... ] }`           |

### 6. Category []

| Method | Path          | Description         | Request Body | Params | Query | Authen | Response                    |
| ------ | ------------- | ------------------- | ------------ | ------ | ----- | ------ | --------------------------- |
| GET    | `/categories` | ดู category ทั้งหมด | -            | -      | -     | ✖      | `{ "categories": [ ... ] }` |
