export interface Material {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  supplierRating: number;
  rating: number;
  reviews: number;
  stock: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockQty: number;
  eta: string;
  transport: number;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  tags: string[];
  isNew?: boolean;
  discount?: number;
}

export const MATERIALS: Material[] = [
  {
    id: 'steel-rebar-g60',
    name: 'Grade 60 Steel Rebar',
    category: 'Structural',
    price: 850,
    unit: 'Ton',
    supplier: 'Titan Steelworks',
    supplierRating: 4.9,
    rating: 4.8,
    reviews: 124,
    stock: 'In Stock',
    stockQty: 450,
    eta: '2 hrs',
    transport: 150,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'High-tensile Grade 60 steel reinforcement bar for critical structural applications. Meets IS 1786:2008 standards. Ideal for RCC construction, bridges, and heavy-load bearing structures.',
    specs: { 'Grade': 'Fe500/Grade 60', 'Length': '12 m', 'Diameter': '8–32 mm', 'Tensile Strength': '600 MPa', 'Yield Strength': '500 MPa', 'Standard': 'IS 1786:2008', 'Finish': 'Hot Rolled', 'Min. Order': '1 Ton' },
    tags: ['TMT', 'Reinforcement', 'Structural', 'RCC'],
    isNew: false,
  },
  {
    id: 'cement-portland',
    name: 'Portland Cement OPC 53',
    category: 'Binders',
    price: 14,
    unit: 'Bag',
    supplier: 'National Cement Co.',
    supplierRating: 4.7,
    rating: 4.6,
    reviews: 89,
    stock: 'Low Stock',
    stockQty: 45,
    eta: '4 hrs',
    transport: 80,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Ordinary Portland Cement OPC 53 Grade for high-strength concrete. Provides superior workability, consistent setting, and long-term durability. BIS certified.',
    specs: { 'Grade': 'OPC 53', 'Weight': '50 kg/bag', 'Setting Time': '30–600 min', 'Compressive Strength': '53 MPa', 'Standard': 'IS 269:2015', 'Min. Order': '10 Bags', 'Shelf Life': '3 months', 'Packaging': 'HDPE Bag' },
    tags: ['OPC', 'Cement', 'Binder', 'Concrete'],
    isNew: false,
  },
  {
    id: 'crushed-granite',
    name: 'Crushed Granite 20mm',
    category: 'Aggregates',
    price: 480,
    unit: 'Ton',
    supplier: 'RockSolid Quarries',
    supplierRating: 4.8,
    rating: 4.7,
    reviews: 203,
    stock: 'In Stock',
    stockQty: 1200,
    eta: '3 hrs',
    transport: 200,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Washed and graded 20mm crushed granite aggregate for high-strength concrete mixes. Free from impurities and organic matter. Ideal for foundations, slabs, and structural concrete.',
    specs: { 'Size': '20 mm', 'Type': 'Crushed Granite', 'Specific Gravity': '2.65', 'Water Absorption': '< 1%', 'Impact Value': '< 25%', 'Min. Order': '5 Tons', 'Delivery': 'Bulk Truck', 'Standard': 'IS 383:2016' },
    tags: ['Aggregate', 'Granite', 'Coarse', 'Concrete'],
  },
  {
    id: 'river-sand',
    name: 'Washed River Sand (M-Sand)',
    category: 'Sand',
    price: 220,
    unit: 'Ton',
    supplier: 'SandMart Pvt. Ltd.',
    supplierRating: 4.5,
    rating: 4.5,
    reviews: 156,
    stock: 'In Stock',
    stockQty: 800,
    eta: '2 hrs',
    transport: 100,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Clean washed river sand for plastering, concrete, and masonry work. Zone II graded. Free from silt, clay, and organic matter. Consistent fineness modulus for quality concrete.',
    specs: { 'Zone': 'Zone II', 'FM': '2.60–2.90', 'Silt Content': '< 3%', 'Type': 'M-Sand / River Sand', 'Min. Order': '2 Tons', 'Delivery': 'Tipper Truck', 'Grading': 'IS 383:2016' , 'Moisture': '< 5%' },
    tags: ['Sand', 'M-Sand', 'Plaster', 'Masonry'],
    isNew: true,
  },
  {
    id: 'laterite-stone',
    name: 'Laterite Stone Blocks',
    category: 'Masonry',
    price: 12,
    unit: 'Piece',
    supplier: 'Kerala Stone Depot',
    supplierRating: 4.6,
    rating: 4.4,
    reviews: 78,
    stock: 'In Stock',
    stockQty: 3000,
    eta: 'Tomorrow',
    transport: 180,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Naturally cut laterite stone blocks for eco-friendly construction. Excellent thermal insulation, high durability, and moisture resistance. Widely used in South Indian and coastal construction.',
    specs: { 'Size': '300×200×150 mm', 'Weight': '8–10 kg', 'Compressive Strength': '3.5 MPa', 'Water Absorption': '< 12%', 'Min. Order': '100 Pieces', 'Origin': 'Kerala', 'Cutting': 'Machine Cut', 'Finish': 'Natural' },
    tags: ['Laterite', 'Stone', 'Masonry', 'Eco-Friendly'],
  },
  {
    id: 'fly-ash-bricks',
    name: 'Fly Ash Bricks (ISI Marked)',
    category: 'Masonry',
    price: 8,
    unit: 'Piece',
    supplier: 'GreenBuild Bricks',
    supplierRating: 4.8,
    rating: 4.7,
    reviews: 312,
    stock: 'In Stock',
    stockQty: 15000,
    eta: '3 hrs',
    transport: 90,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'ISI-certified fly ash bricks manufactured with industrial fly ash and lime. Eco-friendly alternative to red bricks. Uniform size, higher strength, and lower water absorption than traditional clay bricks.',
    specs: { 'Size': '230×110×75 mm', 'Weight': '3.5 kg', 'Compressive Strength': '7.5 MPa', 'Water Absorption': '< 12%', 'Standard': 'IS 12894:2002', 'Min. Order': '500 Pieces', 'Certification': 'ISI Marked', 'Eco': 'Green Building Certified' },
    tags: ['Bricks', 'Fly Ash', 'Masonry', 'Eco'],
    isNew: true,
    discount: 10,
  },
  {
    id: 'timber-planks',
    name: 'Hardwood Timber Planks',
    category: 'Timber',
    price: 1200,
    unit: 'Ton',
    supplier: 'GreenForest Supplies',
    supplierRating: 4.5,
    rating: 4.5,
    reviews: 67,
    stock: 'In Stock',
    stockQty: 80,
    eta: 'Tomorrow',
    transport: 120,
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Seasoned hardwood timber planks for formwork, shuttering, and structural use. Properly dried and treated for durability. Available in multiple sizes and grades.',
    specs: { 'Type': 'Seasoned Hardwood', 'Thickness': '25–75 mm', 'Width': '100–300 mm', 'Length': '2.5–6 m', 'Moisture': '< 15%', 'Treatment': 'Preservative Treated', 'Min. Order': '0.5 Ton', 'Grade': 'Construction Grade' },
    tags: ['Timber', 'Formwork', 'Shuttering', 'Hardwood'],
  },
  {
    id: 'coarse-aggregate',
    name: 'Coarse Aggregate 40mm',
    category: 'Aggregates',
    price: 380,
    unit: 'Ton',
    supplier: 'RockSolid Quarries',
    supplierRating: 4.8,
    rating: 4.6,
    reviews: 134,
    stock: 'In Stock',
    stockQty: 900,
    eta: '3 hrs',
    transport: 180,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Washed 40mm coarse aggregate for mass concrete, sub-base filling, and road construction. Uniform gradation and clean surface ensures good bonding with cement paste.',
    specs: { 'Size': '40 mm', 'Type': 'Crushed Stone', 'Specific Gravity': '2.67', 'Flakiness Index': '< 30%', 'Los Angeles Abrasion': '< 40%', 'Min. Order': '5 Tons', 'Delivery': 'Bulk', 'Standard': 'IS 383:2016' },
    tags: ['Aggregate', 'Coarse', 'Road', 'Foundation'],
  },
];

export function getMaterialById(id: string): Material | undefined {
  return MATERIALS.find(m => m.id === id);
}

export function getSimilarMaterials(id: string, count = 3): Material[] {
  const mat = getMaterialById(id);
  if (!mat) return [];
  return MATERIALS.filter(m => m.id !== id && m.category === mat.category).slice(0, count)
    .concat(MATERIALS.filter(m => m.id !== id && m.category !== mat.category)).slice(0, count);
}
