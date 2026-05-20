-- Run this in Supabase SQL Editor to insert ALL materials from your app
-- This will populate your database so the app shows data right away
-- If you already inserted the first 2 rows, this INSERT will skip them (ON CONFLICT DO NOTHING)

INSERT INTO public.materials (
  id, name, category, price, unit, supplier, supplier_rating,
  rating, reviews, stock, stock_qty, eta, transport,
  image, images, description, specs, tags, is_new, discount
)
VALUES
(
  'steel-rebar-g60', 'Grade 60 Steel Rebar', 'Structural', 850, 'Ton', 'Titan Steelworks', 4.9,
  4.8, 124, 'In Stock', 450, '2 hrs', 150,
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'],
  'High-tensile Grade 60 steel reinforcement bar for critical structural applications. Meets IS 1786:2008 standards. Ideal for RCC construction, bridges, and heavy-load bearing structures.',
  '{"Grade":"Fe500/Grade 60","Length":"12 m","Diameter":"8–32 mm","Tensile Strength":"600 MPa","Yield Strength":"500 MPa","Standard":"IS 1786:2008","Finish":"Hot Rolled","Min. Order":"1 Ton"}',
  ARRAY['TMT','Reinforcement','Structural','RCC'], false, 0
),
(
  'cement-portland', 'Portland Cement OPC 53', 'Binders', 14, 'Bag', 'National Cement Co.', 4.7,
  4.6, 89, 'Low Stock', 45, '4 hrs', 80,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop'],
  'Ordinary Portland Cement OPC 53 Grade for high-strength concrete. Provides superior workability, consistent setting, and long-term durability. BIS certified.',
  '{"Grade":"OPC 53","Weight":"50 kg/bag","Setting Time":"30–600 min","Compressive Strength":"53 MPa","Standard":"IS 269:2015","Min. Order":"10 Bags","Shelf Life":"3 months","Packaging":"HDPE Bag"}',
  ARRAY['OPC','Cement','Binder','Concrete'], false, 0
),
(
  'crushed-granite', 'Crushed Granite 20mm', 'Aggregates', 480, 'Ton', 'RockSolid Quarries', 4.8,
  4.7, 203, 'In Stock', 1200, '3 hrs', 200,
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'],
  'Washed and graded 20mm crushed granite aggregate for high-strength concrete mixes. Free from impurities and organic matter. Ideal for foundations, slabs, and structural concrete.',
  '{"Size":"20 mm","Type":"Crushed Granite","Specific Gravity":"2.65","Water Absorption":"< 1%","Impact Value":"< 25%","Min. Order":"5 Tons","Delivery":"Bulk Truck","Standard":"IS 383:2016"}',
  ARRAY['Aggregate','Granite','Coarse','Concrete'], false, 0
),
(
  'river-sand', 'Washed River Sand (M-Sand)', 'Sand', 220, 'Ton', 'SandMart Pvt. Ltd.', 4.5,
  4.5, 156, 'In Stock', 800, '2 hrs', 100,
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop'],
  'Clean washed river sand for plastering, concrete, and masonry work. Zone II graded. Free from silt, clay, and organic matter.',
  '{"Zone":"Zone II","FM":"2.60–2.90","Silt Content":"< 3%","Type":"M-Sand / River Sand","Min. Order":"2 Tons","Delivery":"Tipper Truck","Grading":"IS 383:2016","Moisture":"< 5%"}',
  ARRAY['Sand','M-Sand','Plaster','Masonry'], true, 0
),
(
  'laterite-stone', 'Laterite Stone Blocks', 'Masonry', 12, 'Piece', 'Kerala Stone Depot', 4.6,
  4.4, 78, 'In Stock', 3000, 'Tomorrow', 180,
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'],
  'Naturally cut laterite stone blocks for eco-friendly construction. Excellent thermal insulation, high durability, and moisture resistance.',
  '{"Size":"300×200×150 mm","Weight":"8–10 kg","Compressive Strength":"3.5 MPa","Water Absorption":"< 12%","Min. Order":"100 Pieces","Origin":"Kerala","Cutting":"Machine Cut","Finish":"Natural"}',
  ARRAY['Laterite','Stone','Masonry','Eco-Friendly'], false, 0
),
(
  'fly-ash-bricks', 'Fly Ash Bricks (ISI Marked)', 'Masonry', 8, 'Piece', 'GreenBuild Bricks', 4.8,
  4.7, 312, 'In Stock', 15000, '3 hrs', 90,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop'],
  'ISI-certified fly ash bricks manufactured with industrial fly ash and lime. Eco-friendly alternative to red bricks.',
  '{"Size":"230×110×75 mm","Weight":"3.5 kg","Compressive Strength":"7.5 MPa","Water Absorption":"< 12%","Standard":"IS 12894:2002","Min. Order":"500 Pieces","Certification":"ISI Marked","Eco":"Green Building Certified"}',
  ARRAY['Bricks','Fly Ash','Masonry','Eco'], true, 10
),
(
  'timber-planks', 'Hardwood Timber Planks', 'Timber', 1200, 'Ton', 'GreenForest Supplies', 4.5,
  4.5, 67, 'In Stock', 80, 'Tomorrow', 120,
  'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800&auto=format&fit=crop'],
  'Seasoned hardwood timber planks for formwork, shuttering, and structural use. Properly dried and treated for durability.',
  '{"Type":"Seasoned Hardwood","Thickness":"25–75 mm","Width":"100–300 mm","Length":"2.5–6 m","Moisture":"< 15%","Treatment":"Preservative Treated","Min. Order":"0.5 Ton","Grade":"Construction Grade"}',
  ARRAY['Timber','Formwork','Shuttering','Hardwood'], false, 0
),
(
  'coarse-aggregate', 'Coarse Aggregate 40mm', 'Aggregates', 380, 'Ton', 'RockSolid Quarries', 4.8,
  4.6, 134, 'In Stock', 900, '3 hrs', 180,
  'https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop'],
  'Washed 40mm coarse aggregate for mass concrete, sub-base filling, and road construction.',
  '{"Size":"40 mm","Type":"Crushed Stone","Specific Gravity":"2.67","Flakiness Index":"< 30%","Los Angeles Abrasion":"< 40%","Min. Order":"5 Tons","Delivery":"Bulk","Standard":"IS 383:2016"}',
  ARRAY['Aggregate','Coarse','Road','Foundation'], false, 0
)
ON CONFLICT (id) DO NOTHING;
