# Teachify Data Model

## Course Curriculum (ordered hierarchy)

```
Course
├── Curriculum (1:1)
│   └── Section* (ordered by position)
│       └── Lecture* (ordered by position)
│           └── Attachment* (ordered)
│               Types: video, audio, pdf, application, image,
│                      embed_link, external_link, text, public_image
├── CurriculumPlan* (pricing plans)
│   Types: free, one_time_purchase, subscription, pre_order, group_buy, fixed_date, specific_length
├── CourseCategory (optional; hierarchical)
├── Tags (many)
├── Lecturers/Authors (many)
├── Reviews (many)
├── Promo Video (single Attachment)
└── Comments (nested/threaded, polymorphic)
```

Navigation: `list_courses` → `get_course` (returns sections) → `list_lessons` (returns lectures).

## Membership Plan

```
MembershipPlan (types: recurring, fixed_date, specific_length, lifetime)
├── Courses (many-to-many)
├── Post Categories (many-to-many)
├── Pricings (many; interval: month, year, day)
├── Subscriptions (many)
│   States: active, incomplete, trialing, past_due, canceled, expired
└── FAQ Sections (ordered)
```

## Event

```
Event
├── Ticket* (ordered by position; each type has its own price/capacity)
├── Enrollments/Attendees
│   States: enrolled, checked_in, no_show, cancelled
├── EventCategory (hierarchical)
└── Lecturers (many)
```

## Post

```
Post
├── PostCategory (optional; hierarchical)
├── Tags (many)
├── Author
├── Comments (nested/threaded)
└── access_type: login_required | paid | public_access
```

## Order / Payment

```
Payment (order)
├── Lineitems* → Item (polymorphic)
│   Types: CurriculumPlan, MembershipPlan, Ticket, DigitalProduct, OrderBump, Meeting
│   Each lineitem: original_amount, discount_amount, amount
├── CouponRedemption (optional)
└── payment_state: not_paid | paid | expired | failed | manual_enrolled | refunded
```

## Comment (polymorphic, threaded)

```
Comment
├── belongs_to commentable (Course | Lecture | Post | Submission | Comment)
├── belongs_to commenter (User)
├── has_many replies (nested comments)
└── role_type: student | teaching_assistant | lecturer | manager
```
