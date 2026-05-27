import { Book, Artwork, Testimonial, PartnershipTier } from './types';

export const BOOKS: Book[] = [
  {
    id: 'art-of-watercolor',
    title: 'Exploring Art and Time - A-Level Art History',
    slug: 'exploring-art-and-time',
    coverImage: '/a5.png',
    type: 'Hardcover',
    level: 'A-Level',
    price: 7.00,
    ebookPrice: 4.00,
    stock: 45, // In stock
    description: "Exploring Art and Time is a brand-new A-Level Art History textbook, fully updated to match the New Upper Secondary School Curriculum, making it the perfect study guide for students and a great resource for teachers. It explains important historical art movements in simple English, helping students understand concepts easily and pass their exams with confidence.",
    shortDescription: "A brand-new A-Level Art History textbook matching the New Upper Secondary School Curriculum. Sized in portable A5 for easy classroom learning.",
    pages: 188,
    isbn: '978-9970-234-01-2',
    publishYear: 2026,
    rating: 4.9,
    reviewsCount: 174,
    curriculumTags: ['New A-Level Curriculum', 'Study Revision Guide', 'Exam Success Guide', 'A5 Portable Edition'],
    lookInside: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=600'
    ],
    downloadUrl: '/downloads/exploring_art_and_time_preview.pdf'
  },
  {
    id: 'composition-sketching',
    title: 'Studio Technology - For both O-Level and A-Level',
    slug: 'studio-technology',
    coverImage: '/a6.png',
    type: 'Workbook',
    level: 'O & A Level',
    price: 10.00,
    ebookPrice: 5.00,
    stock: 28, // In stock, low stock
    description: "The ultimate student and educator manual for mastering physical studio technologies in East African secondary classrooms. It features exhaustive sections on local material extraction, organic pigment chemistry, traditional pottery and clay preparation, loom weaving, block printmaking, and graphic design fundamentals. Tailored to support practical coursework sheets with clear structured illustrations.",
    shortDescription: 'The comprehensive syllabus manual for local materials, raw pigment chemistry, weaving, clay curing, and printmaking.',
    pages: 240,
    isbn: '978-9970-234-02-9',
    publishYear: 2025,
    rating: 4.8,
    reviewsCount: 89,
    curriculumTags: ['Pigment Chemistry', 'Pottery & Clay', 'Weaving Dynamics', 'Graphic Printmaking'],
    lookInside: [
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600'
    ],
    downloadUrl: '/downloads/studio_technology_preview.pdf'
  },
  {
    id: 'artful-classroom',
    title: 'Art Through Ages - O-Level Art History Simplified',
    slug: 'art-through-ages',
    coverImage: '/a7.png',
    type: 'Workbook',
    level: 'O-Level',
    price: 7.00,
    ebookPrice: 3.50,
    stock: 0, // OUT OF STOCK for hardcover, available for eBook! AI auto-declines hardcover
    description: "A highly simplified, competency-oriented learner handbook matching Uganda's lower secondary secondary curriculum formats. It bridges international art history with contemporary Ugandan community painting, providing student templates, sample assessment tasks, standard rubrics, and inclusive drawing scaffolds.",
    shortDescription: 'Competency-based study workbook packed with simplified visual analysis sheets, assessment keys, and teacher guides.',
    pages: 212,
    isbn: '978-9970-234-03-6',
    publishYear: 2026,
    rating: 5.0,
    reviewsCount: 64,
    curriculumTags: ['Simplified History', 'Syllabus Blueprints', 'Visual Analysis', 'School Assessment'],
    lookInside: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600'
    ],
    downloadUrl: '/downloads/art_through_ages_resource.pdf'
  }
];

export const ARTWORKS: Artwork[] = [
  {
    id: 'shared-burdens',
    title: "Shared Burdens, Silent Strength",
    medium: 'Oil and mixed media on archival textured canvas wash',
    dimensions: '24" x 30"',
    year: 2023,
    image: '/a2.png',
    price: 250500,
    originalAvailable: true,
    status: 'available'
  },
  {
    id: 'strength-struggle',
    title: 'Strength amidst Struggle',
    medium: 'Granulating fluid oils and earthy textures on dense linen fabric',
    dimensions: '18" x 24"',
    year: 2024,
    image: '/a3.png',
    price: 180000,
    originalAvailable: true,
    status: 'available'
  },
  {
    id: 'cost-pleasure',
    title: 'The Cost of Pleasure',
    medium: 'High chroma heavy body impasto oil on stretched board',
    dimensions: '20" x 24"',
    year: 2024,
    image: '/a4.png',
    price: 320000,
    originalAvailable: true,
    status: 'available'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Brother Joseph Mukasa',
    role: 'Fine Arts Director',
    institution: 'Kingstone High School Kawempe',
    quote: "Integrating 'Art Through Ages' into our O-Level classes was incredible. The competency-based assessment guides align beautifully with Uganda's national curriculum. Student practical scores improved immensely.",
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Albert K. Mukasa',
    role: 'Adult Workshop Participant',
    institution: 'Beacon Fine Art Guild',
    quote: "We utilized 'Art and Time' to structure our intensive watercolor workshops. The historical master logs and material worksheets are beautifully drafted, providing high clarity.",
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Sarah Jenkins',
    role: 'Visual Arts Coordinator',
    institution: 'Progressive High School Kasangati',
    quote: "Purchasing booksets through the Class Bundle setup allowed us to secure 45 workbooks easily. Alan was wonderfully accommodating, shipping custom signed bookplates for all our students!",
    rating: 5
  }
];

export const PARTNERSHIP_TIERS: PartnershipTier[] = [
  {
    id: 'licensing',
    badge: 'Curriculum & Licensing',
    title: 'School & District Licensing',
    description: 'Embed our structured textbook curricula, printable worksheets, and teacher assessment guides natively across your entire school department or public district.',
    bullets: [
      'Digital curriculum licensing keys with perpetual school access',
      'Discounted physical textbook shipments (up to 40% bulk discount)',
      'Custom standards mapping sheets aligned with state curriculum requirements',
      'Exclusive high-resolution classroom projection files and worksheets'
    ]
  },
  {
    id: 'workshops',
    badge: 'Workshops & Residencies',
    title: 'Workshop Collaboration & Residencies',
    description: 'Bring a professional artist and certified teacher directly to your institution for masterclasses, weekend intensives, professional development panels, or live demos.',
    bullets: [
      'Interactive teacher PD tutorials on student engagement',
      'Hands-on painting workshops for adult guilds and school groups',
      'Customized lecture series on watercolor glazing, chemistry, and composition',
      'Live painting demonstrations with interactive Q&A roundtables'
    ]
  },
  {
    id: 'galleries',
    badge: 'Representation & Fine Art',
    title: 'Gallery Representation & Commissions',
    description: 'Engage in formal representation contracts, secure commercial leasing for gallery exhibitions, or collaborate on exclusive corporate artwork commissions.',
    bullets: [
      'Exclusive canvas representation and solo exhibition arrangements',
      'Cohesive custom series drafts optimized for modern interior palettes',
      'Corporate space staging packages and art lease agreements',
      'Secured insured worldwide framing and shipping logistics'
    ]
  }
];
