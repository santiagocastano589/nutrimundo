-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-08-2026 a las 18:44:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nutrimundo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `forma_pago`
--

CREATE TABLE `forma_pago` (
  `id_forma_pago` int(11) NOT NULL,
  `tipo_pago` varchar(30) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `valor_pedido` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `id_ingrediente` varchar(30) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `tipo_ingrediente` varchar(50) NOT NULL,
  `costo_unitario` decimal(10,0) NOT NULL,
  `calorias_por_100_gramos` int(11) NOT NULL,
  `stock_actual` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `fecha_pedido` date DEFAULT NULL,
  `estado_pedido` varchar(30) DEFAULT NULL,
  `total_pago` decimal(10,2) DEFAULT NULL,
  `descripcion` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platillos`
--

CREATE TABLE `platillos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `tag` varchar(100) DEFAULT 'Saludable',
  `img` varchar(500) DEFAULT '',
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `platillos`
--

INSERT INTO `platillos` (`id`, `nombre`, `categoria`, `descripcion`, `precio`, `tag`, `img`, `fecha_creacion`) VALUES
(1, 'Bowl de Salmón & Quinoa Silvestre', 'Fitness', 'Salmón a la plancha, quinoa orgánica, aguacate hass, espinaca baby y vinagreta cítrica.', 28500.00, '🥗 Alto en Proteína', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', '2026-08-15 11:39:54'),
(2, 'Bandeja Típica Campesina', 'Tipico', 'Corte magro de res, frijoles desgrasados, arroz integral, plátano asado y huevo pochado.', 32000.00, '🍲 Tradicional', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', '2026-08-15 11:39:54'),
(3, 'Lasaña de Berenjena Vegana', 'Vegano', 'Láminas de berenjena, salsa pomodoro casera, queso de almendras y albahaca fresca.', 24000.00, '🌱 100% Vegano', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600', '2026-08-15 11:39:54'),
(4, 'Lomo Fino con Risotto de Setas', 'Gourmet', 'Medallón de lomo fino en reducción de vino tinto y risotto cremoso.', 36500.00, '🥩 Especialidad Chef', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', '2026-08-15 11:39:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plato`
--

CREATE TABLE `plato` (
  `id_plato` int(11) NOT NULL,
  `descripcion_plato` varchar(100) DEFAULT NULL,
  `precio_plato` decimal(10,2) DEFAULT NULL,
  `calorias` int(10) DEFAULT NULL,
  `proteinas` varchar(70) DEFAULT NULL,
  `carbohidratos` varchar(70) DEFAULT NULL,
  `grasas` varchar(70) DEFAULT NULL,
  `es_vegano` varchar(2) DEFAULT 'NO',
  `es_sin_gluten` varchar(2) DEFAULT 'NO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plato_ingrediente`
--

CREATE TABLE `plato_ingrediente` (
  `id_plato_ingrediente` int(11) NOT NULL,
  `id_plato` int(11) NOT NULL,
  `id_ingrediente` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plato_pedido`
--

CREATE TABLE `plato_pedido` (
  `id_plato_pedido` int(11) NOT NULL,
  `id_plato_p` int(11) DEFAULT NULL,
  `id_pedido_p` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(5) NOT NULL,
  `tipo_documento` varchar(5) NOT NULL,
  `documento` bigint(10) NOT NULL,
  `nombre_apellidos` varchar(40) NOT NULL,
  `telefono` bigint(10) NOT NULL,
  `direccion` varchar(20) NOT NULL,
  `preferencia` varchar(30) NOT NULL,
  `fecha_registro` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `contrasena` varchar(120) NOT NULL,
  `rol` varchar(10) NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `tipo_documento`, `documento`, `nombre_apellidos`, `telefono`, `direccion`, `preferencia`, `fecha_registro`, `email`, `contrasena`, `rol`) VALUES
(5, 'CC', 10948935451, 'administrador', 3026512591, 'nutrimundo', 'nutrimundo', '2026-08-15', 'santiagocastano589@gmail.com', 'Admin0504', 'admin'),
(6, 'CC', 12345, 'PEPE', 3026512591, 'Barrio 1', 'Platos Típicos & Tradicionales', '2026-08-15', 'yo@yo', '$2y$10$4.RgACb4tvcXLkwIDO/EYOKgiSLOWr9xCeqWBtwbzHu66i.wX53mC', 'usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `forma_pago`
--
ALTER TABLE `forma_pago`
  ADD PRIMARY KEY (`id_forma_pago`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`id_ingrediente`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`);

--
-- Indices de la tabla `platillos`
--
ALTER TABLE `platillos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `plato`
--
ALTER TABLE `plato`
  ADD PRIMARY KEY (`id_plato`);

--
-- Indices de la tabla `plato_ingrediente`
--
ALTER TABLE `plato_ingrediente`
  ADD PRIMARY KEY (`id_plato_ingrediente`),
  ADD KEY `fk_plato` (`id_plato`),
  ADD KEY `fk_ingrediente` (`id_ingrediente`);

--
-- Indices de la tabla `plato_pedido`
--
ALTER TABLE `plato_pedido`
  ADD PRIMARY KEY (`id_plato_pedido`),
  ADD KEY `fk_plato_p` (`id_plato_p`),
  ADD KEY `fk_pedido_p` (`id_pedido_p`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `forma_pago`
--
ALTER TABLE `forma_pago`
  MODIFY `id_forma_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `platillos`
--
ALTER TABLE `platillos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `plato`
--
ALTER TABLE `plato`
  MODIFY `id_plato` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plato_ingrediente`
--
ALTER TABLE `plato_ingrediente`
  MODIFY `id_plato_ingrediente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plato_pedido`
--
ALTER TABLE `plato_pedido`
  MODIFY `id_plato_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `forma_pago`
--
ALTER TABLE `forma_pago`
  ADD CONSTRAINT `fk_pedido_forma_pago` FOREIGN KEY (`id_forma_pago`) REFERENCES `pedidos` (`id_pedido`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_usuario_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `plato_ingrediente`
--
ALTER TABLE `plato_ingrediente`
  ADD CONSTRAINT `fk_ingrediente` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id_ingrediente`),
  ADD CONSTRAINT `fk_plato` FOREIGN KEY (`id_plato`) REFERENCES `plato` (`id_plato`);

--
-- Filtros para la tabla `plato_pedido`
--
ALTER TABLE `plato_pedido`
  ADD CONSTRAINT `fk_pedido_p` FOREIGN KEY (`id_pedido_p`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `fk_plato_p` FOREIGN KEY (`id_plato_p`) REFERENCES `plato` (`id_plato`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
