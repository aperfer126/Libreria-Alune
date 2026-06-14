-- Eliminar la clave foránea antigua de genreId
ALTER TABLE `Book` DROP FOREIGN KEY `Book_genreId_fkey`;

-- Eliminar la columna genreId
ALTER TABLE `Book` DROP COLUMN `genreId`;

-- Crear tabla intermedia para la relación muchos-a-muchos
CREATE TABLE `_BookToGenre` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
    UNIQUE INDEX `_BookToGenre_AB_unique`(`A`, `B`),
    INDEX `_BookToGenre_B_index`(`B`)
);

-- Añadir claves foráneas a la tabla intermedia
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_B_fkey` FOREIGN KEY (`B`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
