import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Fecha relativa al momento de ejecución del seed
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

async function main() {
  // ── Géneros ──────────────────────────────────────────────────────────────
  const genreNames = ['Manga', 'Juvenil', 'Terror', 'Narrativa', 'Fantasía', 'Ciencia Ficción', 'Infantil', 'Ensayo', 'Acción', 'Aventura', 'Romance', 'Histórica']
  const genreMap: Record<string, number> = {}
  for (const name of genreNames) {
    const g = await prisma.genre.upsert({ where: { name }, update: {}, create: { name } })
    genreMap[name] = g.id
  }

  // ── Usuarios ─────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword  = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@libreria.com' },
    update: {},
    create: { email: 'admin@libreria.com', password: adminPassword, name: 'Administrador', role: 'ADMIN' },
  })
  const user1 = await prisma.user.upsert({
    where: { email: 'usuario@ejemplo.com' },
    update: {},
    create: { email: 'usuario@ejemplo.com', password: userPassword, name: 'Usuario Ejemplo', role: 'USER' },
  })
  const user2 = await prisma.user.upsert({
    where: { email: 'maria@ejemplo.com' },
    update: {},
    create: { email: 'maria@ejemplo.com', password: userPassword, name: 'María García', role: 'USER' },
  })
  const user3 = await prisma.user.upsert({
    where: { email: 'carlos@ejemplo.com' },
    update: {},
    create: { email: 'carlos@ejemplo.com', password: userPassword, name: 'Carlos Martínez', role: 'USER' },
  })

  // ── Libros ───────────────────────────────────────────────────────────────
  // createdAt controla el badge "Novedad" (< 30 días = novedad)
  const booksData = [
    // ── Novedades recientes (< 30 días) ─────────────────────────────────
    { isbn: '9788467901234', createdAt: daysAgo(5),  title: 'Attack on Titan Vol. 1',            author: 'Hajime Isayama',          price: 8.95,  stock: 20, genres: ['Manga', 'Acción', 'Terror'],                       coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',  publisher: 'Norma Editorial',   pages: 192,  binding: 'Rústica',     publishedAt: new Date('2013-06-01'), description: 'En un mundo donde la humanidad vive amurallada para sobrevivir a los titanes, Eren Jaeger jura venganza tras presenciar la caída de su ciudad.' },
    { isbn: '9788411401234', createdAt: daysAgo(10), title: 'One Piece Vol. 100',                 author: 'Eiichiro Oda',             price: 9.50,  stock: 15, genres: ['Manga', 'Acción', 'Aventura'],                     coverUrl: 'https://covers.openlibrary.org/b/id/12003963-L.jpg', publisher: 'Planeta Cómic',     pages: 208,  binding: 'Rústica',     publishedAt: new Date('2022-03-10'), description: 'El volumen 100 de la épica aventura de Monkey D. Luffy en busca del tesoro más grande del mundo: el One Piece.' },
    { isbn: '9788467901236', createdAt: daysAgo(7),  title: 'Demon Slayer Vol. 1',                author: 'Koyoharu Gotouge',         price: 8.50,  stock: 25, genres: ['Manga', 'Acción', 'Terror'],                       coverUrl: 'https://covers.openlibrary.org/b/id/10521270-L.jpg', publisher: 'Norma Editorial',   pages: 192,  binding: 'Rústica',     publishedAt: new Date('2020-05-15'), description: 'Tanjiro Kamado se convierte en cazador de demonios para salvar a su hermana Nezuko, convertida en demonio tras la masacre de su familia.' },
    { isbn: '9788478884452', createdAt: daysAgo(3),  title: 'Harry Potter y la Piedra Filosofal', author: 'J.K. Rowling',             price: 19.95, stock: 22, genres: ['Juvenil', 'Fantasía', 'Aventura'],                coverUrl: 'https://covers.openlibrary.org/b/id/10110415-L.jpg', publisher: 'Salamandra',        pages: 264,  binding: 'Tapa blanda', publishedAt: new Date('1997-06-26'), description: 'Harry Potter descubre en su undécimo cumpleaños que es un mago y comienza sus estudios en Hogwarts, la escuela de magia y hechicería.' },
    { isbn: '9788498381221', createdAt: daysAgo(15), title: 'Percy Jackson y el Ladrón del Rayo', author: 'Rick Riordan',             price: 14.95, stock: 16, genres: ['Juvenil', 'Fantasía', 'Aventura', 'Acción'],     coverUrl: 'https://covers.openlibrary.org/b/id/8739228-L.jpg',  publisher: 'Salamandra',        pages: 392,  binding: 'Tapa blanda', publishedAt: new Date('2005-07-01'), description: 'Percy Jackson descubre que es hijo de Poseidón y debe recuperar el rayo maestro de Zeus para evitar una guerra entre los dioses del Olimpo.' },
    { isbn: '9788401352799', createdAt: daysAgo(20), title: 'El Resplandor',                      author: 'Stephen King',             price: 18.90, stock: 11, genres: ['Terror', 'Narrativa'],                             coverUrl: 'https://covers.openlibrary.org/b/id/8228671-L.jpg',  publisher: 'Plaza & Janés',     pages: 528,  binding: 'Tapa blanda', publishedAt: new Date('1977-01-28'), description: 'Jack Torrance lleva a su familia al aislado hotel Overlook durante el invierno. Lo que allí encuentran pondrá a prueba su cordura.' },
    { isbn: '9788437604947', createdAt: daysAgo(12), title: 'Cien Años de Soledad',               author: 'Gabriel García Márquez',   price: 21.00, stock: 15, genres: ['Narrativa', 'Histórica'],                          coverUrl: 'https://covers.openlibrary.org/b/id/8228661-L.jpg',  publisher: 'Cátedra',           pages: 496,  binding: 'Tapa blanda', publishedAt: new Date('1967-05-30'), description: 'La historia de la familia Buendía a lo largo de siete generaciones en el pueblo mítico de Macondo, emblema del realismo mágico.' },
    { isbn: '9788497595858', createdAt: daysAgo(8),  title: 'Dune',                               author: 'Frank Herbert',            price: 20.95, stock: 18, genres: ['Ciencia Ficción', 'Aventura'],                     coverUrl: 'https://covers.openlibrary.org/b/id/8739181-L.jpg',  publisher: 'Debolsillo',        pages: 896,  binding: 'Tapa blanda', publishedAt: new Date('1965-08-01'), description: 'En el planeta desértico Arrakis, único lugar donde se produce la especia más valiosa del universo, Paul Atreides asume su destino como mesías.' },

    // ── Libros antiguos (> 30 días) ──────────────────────────────────────
    { isbn: '9788467901235', createdAt: daysAgo(60), title: 'Naruto Vol. 1',                      author: 'Masashi Kishimoto',        price: 7.95,  stock: 30, genres: ['Manga', 'Acción', 'Aventura'],                     coverUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',  publisher: 'Norma Editorial',   pages: 186,  binding: 'Rústica',     publishedAt: new Date('2002-09-01'), description: 'Naruto Uzumaki, un joven ninja con el espíritu del zorro de nueve colas sellado dentro de él, sueña con convertirse en Hokage.' },
    { isbn: '9788411401235', createdAt: daysAgo(90), title: 'My Hero Academia Vol. 1',            author: 'Kohei Horikoshi',          price: 8.95,  stock: 18, genres: ['Manga', 'Acción'],                                 coverUrl: 'https://covers.openlibrary.org/b/id/9255566-L.jpg',  publisher: 'Planeta Cómic',     pages: 200,  binding: 'Rústica',     publishedAt: new Date('2016-11-01'), description: 'En un mundo donde casi todos poseen superpoderes, Izuku Midoriya nace sin ninguno pero sueña con ser el mayor héroe de todos.' },
    { isbn: '9788445000526', createdAt: daysAgo(45), title: 'El Señor de los Anillos',            author: 'J.R.R. Tolkien',           price: 24.90, stock: 10, genres: ['Fantasía', 'Aventura'],                            coverUrl: 'https://covers.openlibrary.org/b/id/8743161-L.jpg',  publisher: 'Minotauro',         pages: 1264, binding: 'Tapa dura',   publishedAt: new Date('1954-07-29'), description: 'La obra cumbre de la fantasía épica. Frodo Bolsón emprende un viaje para destruir el Anillo Único y salvar la Tierra Media.' },
    { isbn: '9788427200449', createdAt: daysAgo(75), title: 'Los Juegos del Hambre',              author: 'Suzanne Collins',          price: 17.50, stock: 12, genres: ['Juvenil', 'Acción', 'Ciencia Ficción'],           coverUrl: 'https://covers.openlibrary.org/b/id/8228681-L.jpg',  publisher: 'Molino',            pages: 400,  binding: 'Tapa blanda', publishedAt: new Date('2008-09-14'), description: 'En la distópica Panem, Katniss Everdeen se ofrece voluntaria para sustituir a su hermana en los mortales Juegos del Hambre.' },
    { isbn: '9788427200456', createdAt: daysAgo(50), title: 'Divergente',                         author: 'Veronica Roth',            price: 16.90, stock: 9,  genres: ['Juvenil', 'Acción', 'Romance', 'Ciencia Ficción'],  coverUrl: 'https://covers.openlibrary.org/b/id/9255586-L.jpg',  publisher: 'Molino',            pages: 496,  binding: 'Tapa blanda', publishedAt: new Date('2011-04-25'), description: 'En un Chicago futurista dividido en facciones según las virtudes, Tris descubre que es Divergente y que su secreto podría costarle la vida.' },
    { isbn: '9788401352782', createdAt: daysAgo(80), title: 'It',                                 author: 'Stephen King',             price: 22.95, stock: 14, genres: ['Terror', 'Narrativa'],                             coverUrl: 'https://covers.openlibrary.org/b/id/8739171-L.jpg',  publisher: 'Plaza & Janés',     pages: 1168, binding: 'Tapa blanda', publishedAt: new Date('1986-09-15'), description: 'En Derry, Maine, un grupo de niños se enfrenta a una entidad maligna que adopta la forma de sus peores miedos: el payaso Pennywise.' },
    { isbn: '9788420633930', createdAt: daysAgo(55), title: 'Frankenstein',                       author: 'Mary Shelley',             price: 9.95,  stock: 20, genres: ['Terror', 'Ciencia Ficción', 'Histórica'],          coverUrl: 'https://covers.openlibrary.org/b/id/8739131-L.jpg',  publisher: 'Alianza Editorial', pages: 288,  binding: 'Rústica',     publishedAt: new Date('1818-01-01'), description: 'El joven científico Víctor Frankenstein crea vida a partir de materia inerte, dando origen a una criatura que busca desesperadamente amor y aceptación.' },
    { isbn: '9788420633947', createdAt: daysAgo(40), title: 'Drácula',                            author: 'Bram Stoker',              price: 10.50, stock: 17, genres: ['Terror', 'Histórica'],                             coverUrl: 'https://covers.openlibrary.org/b/id/12547191-L.jpg', publisher: 'Alianza Editorial', pages: 448,  binding: 'Rústica',     publishedAt: new Date('1897-05-26'), description: 'A través de diarios y cartas, se narra el encuentro del conde Drácula con Jonathan Harker y su posterior llegada a Inglaterra en busca de sangre.' },
    { isbn: '9788401352805', createdAt: daysAgo(65), title: 'La Casa de los Espíritus',           author: 'Isabel Allende',           price: 19.95, stock: 8,  genres: ['Narrativa', 'Histórica'],                          coverUrl: 'https://covers.openlibrary.org/b/id/8739151-L.jpg',  publisher: 'Plaza & Janés',     pages: 432,  binding: 'Tapa blanda', publishedAt: new Date('1982-10-01'), description: 'La saga de la familia Trueba a lo largo de varias generaciones en un país latinoamericano marcado por la dictadura y lo mágico.' },
    { isbn: '9788420412146', createdAt: daysAgo(100),title: 'Don Quijote de la Mancha',           author: 'Miguel de Cervantes',      price: 14.95, stock: 25, genres: ['Narrativa', 'Aventura', 'Histórica'],              coverUrl: 'https://covers.openlibrary.org/b/id/8739141-L.jpg',  publisher: 'Alfaguara',         pages: 1376, binding: 'Tapa dura',   publishedAt: new Date('1605-01-16'), description: 'El ingenioso hidalgo don Quijote de la Mancha emprende aventuras junto a su fiel escudero Sancho Panza en la España del siglo XVII.' },
    { isbn: '9788408163435', createdAt: daysAgo(35), title: 'La Sombra del Viento',               author: 'Carlos Ruiz Zafón',        price: 18.50, stock: 13, genres: ['Narrativa', 'Terror', 'Histórica'],               coverUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',  publisher: 'Planeta',           pages: 560,  binding: 'Tapa blanda', publishedAt: new Date('2001-04-01'), description: 'En la Barcelona de posguerra, el joven Daniel Sempere descubre un libro misterioso cuyo autor parece estar siendo borrado de la historia.' },
    { isbn: '9788401337208', createdAt: daysAgo(70), title: 'El Nombre del Viento',               author: 'Patrick Rothfuss',         price: 22.90, stock: 10, genres: ['Fantasía', 'Aventura'],                            coverUrl: 'https://covers.openlibrary.org/b/id/9255546-L.jpg',  publisher: 'Plaza & Janés',     pages: 880,  binding: 'Tapa blanda', publishedAt: new Date('2007-03-27'), description: 'Kvothe, el legendario mago, relata su extraordinaria vida: desde sus humildes orígenes hasta convertirse en el hombre más temido de su época.' },

    // ── Stock bajo (< 5) ─────────────────────────────────────────────────
    { isbn: '9788498387865', createdAt: daysAgo(45), title: 'Neuromante',                         author: 'William Gibson',           price: 16.50, stock: 3,  genres: ['Ciencia Ficción', 'Acción'],                       coverUrl: 'https://covers.openlibrary.org/b/id/8228651-L.jpg',  publisher: 'Minotauro',         pages: 320,  binding: 'Tapa blanda', publishedAt: new Date('1984-07-01'), description: 'La novela fundacional del cyberpunk. Case, un hacker caído en desgracia, recibe una última oportunidad para acceder al ciberespacio en una misión suicida.' },
    { isbn: '9788408107842', createdAt: daysAgo(55), title: '1984',                               author: 'George Orwell',            price: 12.90, stock: 2,  genres: ['Ciencia Ficción', 'Narrativa'],                     coverUrl: 'https://covers.openlibrary.org/b/id/8228641-L.jpg',  publisher: 'Debolsillo',        pages: 336,  binding: 'Tapa blanda', publishedAt: new Date('1949-06-08'), description: 'En el totalitario Oceanía, Winston Smith trabaja para el Partido reescribiendo la historia y empieza a cuestionar el sistema de vigilancia permanente.' },
    { isbn: '9788497938419', createdAt: daysAgo(25), title: 'El Principito',                      author: 'Antoine de Saint-Exupéry', price: 9.95,  stock: 4,  genres: ['Infantil', 'Narrativa'],                           coverUrl: 'https://covers.openlibrary.org/b/id/8739121-L.jpg',  publisher: 'Salamandra',        pages: 112,  binding: 'Tapa dura',   publishedAt: new Date('1943-04-06'), description: 'Un aviador perdido en el desierto conoce a un pequeño príncipe que ha viajado desde su asteroide en busca de un amigo, enseñándole el valor de lo esencial.' },
    { isbn: '9788420674650', createdAt: daysAgo(90), title: 'Orgullo y Prejuicio',                author: 'Jane Austen',              price: 11.50, stock: 1,  genres: ['Romance', 'Histórica', 'Narrativa'],               coverUrl: 'https://covers.openlibrary.org/b/id/9255526-L.jpg',  publisher: 'Alianza Editorial', pages: 432,  binding: 'Rústica',     publishedAt: new Date('1813-01-28'), description: 'La inteligente y perspicaz Elizabeth Bennet y el orgulloso Mr. Darcy protagonizan uno de los romances más célebres de la literatura inglesa.' },
    { isbn: '9788445077832', createdAt: daysAgo(60), title: 'Sapiens: De animales a dioses',      author: 'Yuval Noah Harari',        price: 23.90, stock: 2,  genres: ['Ensayo', 'Histórica'],                             coverUrl: 'https://covers.openlibrary.org/b/id/10521280-L.jpg', publisher: 'Debate',            pages: 496,  binding: 'Tapa blanda', publishedAt: new Date('2011-01-01'), description: 'Un fascinante recorrido por la historia de la humanidad, desde los primeros homínidos hasta la era digital, analizando cómo el Homo sapiens dominó el mundo.' },

    // ── Mismo autor: J.K. Rowling ─────────────────────────────────────────
    { isbn: '9788478884469', createdAt: daysAgo(18), title: 'Harry Potter y la Cámara Secreta',   author: 'J.K. Rowling',             price: 19.95, stock: 20, genres: ['Juvenil', 'Fantasía', 'Aventura'],                coverUrl: 'https://covers.openlibrary.org/b/id/10110416-L.jpg', publisher: 'Salamandra',        pages: 286,  binding: 'Tapa blanda', publishedAt: new Date('1998-07-02'), description: 'En su segundo año en Hogwarts, Harry Potter descubre que alguien ha abierto la Cámara de los Secretos, dejando a los estudiantes paralizados de terror.' },
    { isbn: '9788478884476', createdAt: daysAgo(50), title: 'Harry Potter y el Prisionero de Azkaban', author: 'J.K. Rowling',        price: 19.95, stock: 17, genres: ['Juvenil', 'Fantasía', 'Aventura'],                coverUrl: 'https://covers.openlibrary.org/b/id/10110417-L.jpg', publisher: 'Salamandra',        pages: 360,  binding: 'Tapa blanda', publishedAt: new Date('1999-07-08'), description: 'Un peligroso fugitivo escapa de la inescapable prisión de Azkaban. Sirius Black parece estar relacionado con Voldemort y con el pasado de Harry.' },

    // ── Mismo autor: Stephen King ────────────────────────────────────────
    { isbn: '9788401352812', createdAt: daysAgo(22), title: 'Misery',                             author: 'Stephen King',             price: 17.95, stock: 9,  genres: ['Terror', 'Narrativa'],                             coverUrl: 'https://covers.openlibrary.org/b/id/8228672-L.jpg',  publisher: 'Plaza & Janés',     pages: 400,  binding: 'Tapa blanda', publishedAt: new Date('1987-06-08'), description: 'El escritor Paul Sheldon es rescatado tras un accidente de coche por su mayor fan, Annie Wilkes. Pero el rescate se convierte en una pesadilla.' },
    { isbn: '9788401352829', createdAt: daysAgo(85), title: 'Pet Sematary',                       author: 'Stephen King',             price: 19.50, stock: 6,  genres: ['Terror', 'Narrativa'],                             coverUrl: 'https://covers.openlibrary.org/b/id/8228673-L.jpg',  publisher: 'Plaza & Janés',     pages: 480,  binding: 'Tapa blanda', publishedAt: new Date('1983-11-14'), description: 'Detrás del cementerio de animales que hay en el bosque existe otro lugar, un lugar con un poder más oscuro del que ninguna mente humana puede imaginar.' },

    // ── Mismo autor: J.R.R. Tolkien ──────────────────────────────────────
    { isbn: '9788445001394', createdAt: daysAgo(28), title: 'El Hobbit',                          author: 'J.R.R. Tolkien',           price: 18.90, stock: 14, genres: ['Fantasía', 'Aventura', 'Juvenil'],                coverUrl: 'https://covers.openlibrary.org/b/id/8743162-L.jpg',  publisher: 'Minotauro',         pages: 310,  binding: 'Tapa blanda', publishedAt: new Date('1937-09-21'), description: 'Bilbo Bolsón, un hobbit tranquilo y casero, es arrastrado por el mago Gandalf a una aventura épica junto a trece enanos para recuperar un tesoro enano.' },
  ]

  const bookMap: Record<string, number> = {}
  for (const { genres, ...data } of booksData) {
    const book = await prisma.book.upsert({
      where: { isbn: data.isbn! },
      update: { stock: data.stock, createdAt: data.createdAt },
      create: {
        ...data,
        genres: { connect: genres.map(name => ({ id: genreMap[name] })) },
      },
    })
    bookMap[data.isbn!] = book.id
  }

  // ── Pedidos ──────────────────────────────────────────────────────────────
  // Limpiar y recrear siempre para que el seed sea idempotente
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  const addrMadrid   = JSON.stringify({ name: 'Carlos', surname: 'López Martín', email: 'carlos@example.com', phone: '+34 612 000 001', line1: 'Calle Mayor 12, 3º B', line2: '', city: 'Madrid', postalCode: '28013', country: 'ES' })
  const addrSevilla  = JSON.stringify({ name: 'Ana', surname: 'Fernández Ruiz', email: 'ana@example.com', phone: '+34 622 000 002', line1: 'Avenida de la Constitución 45, 1º A', line2: '', city: 'Sevilla', postalCode: '41001', country: 'ES' })
  const addrBarcelona = JSON.stringify({ name: 'Pedro', surname: 'Sánchez Gil', email: 'pedro@example.com', phone: '+34 633 000 003', line1: 'Paseo de Gracia 88, 5º 2ª', line2: '', city: 'Barcelona', postalCode: '08008', country: 'ES' })
  const addrBilbao   = JSON.stringify({ name: 'Admin', surname: 'Librería', email: 'admin@libreria.com', phone: '+34 944 000 004', line1: 'Calle del Comercio 3', line2: '', city: 'Bilbao', postalCode: '48001', country: 'ES' })

  const orders = [
    {
      userId: user1.id, status: 'PAID' as const,
      createdAt: daysAgo(330),
      shippingAddress: addrMadrid,
      items: [
        { isbn: '9788467901234', qty: 2, price: 8.95 },
        { isbn: '9788478884452', qty: 1, price: 19.95 },
      ],
    },
    {
      userId: user1.id, status: 'PAID' as const,
      createdAt: daysAgo(270),
      shippingAddress: addrMadrid,
      items: [
        { isbn: '9788497595858', qty: 1, price: 20.95 },
        { isbn: '9788401337208', qty: 1, price: 22.90 },
      ],
    },
    {
      userId: user1.id, status: 'PAID' as const,
      createdAt: daysAgo(200),
      shippingAddress: addrMadrid,
      items: [
        { isbn: '9788427200449', qty: 2, price: 17.50 },
      ],
    },
    {
      userId: user2.id, status: 'PAID' as const,
      createdAt: daysAgo(300),
      shippingAddress: addrSevilla,
      items: [
        { isbn: '9788408107842', qty: 1, price: 12.90 },
        { isbn: '9788498387865', qty: 1, price: 16.50 },
        { isbn: '9788497938419', qty: 3, price: 9.95 },
      ],
    },
    {
      userId: user2.id, status: 'CANCELLED' as const,
      createdAt: daysAgo(240),
      shippingAddress: addrSevilla,
      items: [
        { isbn: '9788445000526', qty: 1, price: 24.90 },
      ],
    },
    {
      userId: user3.id, status: 'PAID' as const,
      createdAt: daysAgo(150),
      shippingAddress: addrBarcelona,
      items: [
        { isbn: '9788420674650', qty: 2, price: 11.50 },
        { isbn: '9788437604947', qty: 1, price: 21.00 },
      ],
    },
    {
      userId: user3.id, status: 'PENDING' as const,
      createdAt: daysAgo(80),
      shippingAddress: addrBarcelona,
      items: [
        { isbn: '9788401352782', qty: 1, price: 22.95 },
        { isbn: '9788401352799', qty: 1, price: 18.90 },
        { isbn: '9788420633930', qty: 1, price: 9.95 },
      ],
    },
    {
      userId: admin.id, status: 'PAID' as const,
      createdAt: daysAgo(45),
      shippingAddress: addrBilbao,
      items: [
        { isbn: '9788445077832', qty: 1, price: 23.90 },
        { isbn: '9788408163435', qty: 1, price: 18.50 },
      ],
    },
    {
      userId: user2.id, status: 'PAID' as const,
      createdAt: daysAgo(120),
      shippingAddress: addrSevilla,
      items: [
        { isbn: '9788401352812', qty: 1, price: 17.95 },
        { isbn: '9788445001394', qty: 1, price: 18.90 },
      ],
    },
    {
      userId: user1.id, status: 'PAID' as const,
      createdAt: daysAgo(30),
      shippingAddress: addrMadrid,
      items: [
        { isbn: '9788478884469', qty: 1, price: 19.95 },
        { isbn: '9788478884476', qty: 1, price: 19.95 },
      ],
    },
    {
      userId: user3.id, status: 'PAID' as const,
      createdAt: daysAgo(10),
      shippingAddress: addrBarcelona,
      items: [
        { isbn: '9788401352829', qty: 1, price: 19.50 },
      ],
    },
  ]

  for (const o of orders) {
    const total = o.items.reduce((sum, i) => sum + i.price * i.qty, 0)
    await prisma.order.create({
      data: {
        userId: o.userId,
        status: o.status,
        total,
        createdAt: o.createdAt,
        shippingAddress: o.shippingAddress,
        items: {
          create: o.items.map(i => ({
            bookId: bookMap[i.isbn],
            quantity: i.qty,
            price: i.price,
          })),
        },
      },
    })
  }

  console.log('Seed completado.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
