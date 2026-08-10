-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-08-2026 a las 02:19:46
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
  `contrasena` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `tipo_documento`, `documento`, `nombre_apellidos`, `telefono`, `direccion`, `preferencia`, `fecha_registro`, `email`, `contrasena`) VALUES
(1, 'CC', 1094893545, 'santiago', 3026512591, 'casa 1 barrio 1', 'Platos Típicos & Tradicionales', '2026-08-07', 'yo@yo.com', '$2y$10$w6OqJwXXKcnhfs0.Fgfor.orQwXnSsflcGwbYCsNKs96IQ.v/fZ9q'),
(2, 'TI', 1094925988, 'juan carlos castaño', 3225972816, 'barrio1', 'Comida Vegetariana / Vegana', '2026-08-07', 'juancarloscastanonavarrete@gmail.com', '$2y$10$Ov8fhDhmhQ4ATxmXG3RHkeMqCf7EJ8.qB4ejSb0mWXaUQMRb.eQsO');

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
  MODIFY `id_usuario` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
