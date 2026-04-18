// Product images from /public/products/
// TODO: User will upload real product images to /public/products/ folder
// Current: Using Unsplash placeholders until real images are uploaded

export const productImageFallbacks: Record<string, string> = {
  // TLS = The Last Snow (最後一場雪)
  // When uploaded: /products/TLS.png
  'the-last-snow': 'https://images.unsplash.com/photo-1644141929951-e07aa12a51db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwd2ludGVyJTIwcGVyZnVtZSUyMGJvdHRsZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczMTIxOTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // TFR = The First Rose (初戀玫瑰)
  // When uploaded: /products/TFR.png
  'the-first-rose': 'https://images.unsplash.com/photo-1718068769782-b76cda287298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwZmxvd2VyJTIwcGVyZnVtZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzczMTIxOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // IMNW = It means no worries (無憂時光)
  // When uploaded: /products/IMNW.png
  'no-worries': 'https://images.unsplash.com/photo-1608062414402-a422958aba5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMGhlcmJzJTIwY2l0cnVzJTIwbWluaW1hbHxlbnwxfHx8fDE3NzMxMjE5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // TOL = The Old Library (舊圖書館)
  // When uploaded: /products/TOL.png
  'old-library': 'https://images.unsplash.com/photo-1725190222931-6ef7082182a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBsaWJyYXJ5JTIwYm9va3MlMjB2aW50YWdlfGVufDF8fHx8MTc3MzEyMTkyOHww&ixlib=rb-4.1.0&q=80&w=1080',
  
  // TMG = The Men's Garage (男人車庫)
  // When uploaded: /products/TMG.png
  'mens-garage': 'https://images.unsplash.com/photo-1590880795696-20c7dfadacde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHdvb2R3b3JraW5nJTIwdG9vbHN8ZW58MXx8fHwxNzczMTIxOTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // IR = I'm Rich (我很富有)
  // When uploaded: /products/IR.png
  'im-rich': 'https://images.unsplash.com/photo-1770301410072-f6ef6dad65b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwcGVyZnVtZSUyMGJvdHRsZXxlbnwxfHx8fDE3NzMxMjE5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // TMAIQ = The Morning After I Quit (辭職後的早晨)
  // When uploaded: /products/TMAIQ.png
  'morning-after-quit': 'https://images.unsplash.com/photo-1761056590406-8a1b395281a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwbGlnaHQlMjBiZWRyb29tJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzczMTIxOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // TNWM = The Night Was Mine (那夜屬於我)
  // When uploaded: /products/TNWM.png
  'night-was-mine': 'https://images.unsplash.com/photo-1627809381134-0c0d04201a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaWdhciUyMHNtb2tlJTIwZGFyayUyMGVsZWdhbnR8ZW58MXx8fHwxNzczMTIxOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
};