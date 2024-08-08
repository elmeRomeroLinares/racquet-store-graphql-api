--
-- PostgreSQL database dump
--

-- Dumped from database version 13.15 (Postgres.app)
-- Dumped by pg_dump version 16.3

-- Started on 2024-08-07 19:22:11 CST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 16800)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 652 (class 1247 OID 16860)
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- TOC entry 658 (class 1247 OID 16876)
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'ADMIN',
    'USER',
    'GUEST'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16843)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "modifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16930)
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "cartId" uuid,
    "productId" uuid
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16811)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16867)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    status public.order_status_enum DEFAULT 'PENDING'::public.order_status_enum NOT NULL,
    "userId" uuid
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16946)
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "orderId" uuid,
    "productId" uuid
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16823)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    "imageUrl" character varying,
    disabled boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "modifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "categoryId" uuid
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16883)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16962)
-- Name: user_liked_products_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_liked_products_product (
    "userId" uuid NOT NULL,
    "productId" uuid NOT NULL
);


ALTER TABLE public.user_liked_products_product OWNER TO postgres;

--
-- TOC entry 3344 (class 0 OID 16843)
-- Dependencies: 203
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, "createdAt", "modifiedAt", "userId") FROM stdin;
3c7c98a2-12e2-443b-a4ac-dc0519745dba	2024-07-26 09:10:59.725854	2024-07-26 09:10:59.725854	17bc041c-9b66-47f3-8bce-f3a13fc47620
0babf7e3-8b64-4dce-b603-f0e525f404d3	2024-07-26 16:53:14.989469	2024-07-26 16:53:14.989469	a277d2e3-9e83-4ea9-9948-3be90ad3cb15
\.


--
-- TOC entry 3347 (class 0 OID 16930)
-- Dependencies: 206
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item (id, quantity, "cartId", "productId") FROM stdin;
d00fc3d2-c53c-4d3c-b4b4-b62eaf35d9bf	2	3c7c98a2-12e2-443b-a4ac-dc0519745dba	2af6b331-d2e3-40ee-a025-8ddc990a03b0
54a236de-6217-4ad0-b911-032fde5515eb	8	0babf7e3-8b64-4dce-b603-f0e525f404d3	f4906304-d805-4d30-817d-d7e2a8e310bc
5ba17ef5-7734-4747-b580-2b6b7e9908ba	2	0babf7e3-8b64-4dce-b603-f0e525f404d3	c18f7317-96a9-4312-b142-053e768c873f
\.


--
-- TOC entry 3342 (class 0 OID 16811)
-- Dependencies: 201
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, "createdAt") FROM stdin;
50bcfea7-d580-41e0-a6e6-44be517cb0b9	Category1	2024-07-25 11:29:21.670087
8a79c1db-47f0-4134-833d-b7c6d377076f	Category2	2024-07-25 12:20:19.315005
\.


--
-- TOC entry 3345 (class 0 OID 16867)
-- Dependencies: 204
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, "createdAt", status, "userId") FROM stdin;
1dafb4ff-2ce1-4858-bc8e-cdb2b676ba3e	2024-07-27 09:07:05.884356	PENDING	a277d2e3-9e83-4ea9-9948-3be90ad3cb15
\.


--
-- TOC entry 3348 (class 0 OID 16946)
-- Dependencies: 207
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, quantity, "orderId", "productId") FROM stdin;
8ef74ad0-9efd-4c83-9409-712cc05468f5	8	1dafb4ff-2ce1-4858-bc8e-cdb2b676ba3e	f4906304-d805-4d30-817d-d7e2a8e310bc
864460ac-13b1-4d7c-9af3-d48985e98963	2	1dafb4ff-2ce1-4858-bc8e-cdb2b676ba3e	c18f7317-96a9-4312-b142-053e768c873f
\.


--
-- TOC entry 3343 (class 0 OID 16823)
-- Dependencies: 202
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, price, "imageUrl", disabled, "createdAt", "modifiedAt", "categoryId") FROM stdin;
2af6b331-d2e3-40ee-a025-8ddc990a03b0	Product1Category1	10	\N	f	2024-07-26 09:30:35.561295	2024-07-26 09:30:35.561295	50bcfea7-d580-41e0-a6e6-44be517cb0b9
c18f7317-96a9-4312-b142-053e768c873f	Product3Category1	10	\N	f	2024-07-26 09:35:22.687401	2024-07-26 09:35:22.687401	50bcfea7-d580-41e0-a6e6-44be517cb0b9
8eb2c29e-14b6-45b9-92a4-0298896d6828	Product4Category1	10	\N	f	2024-07-26 09:35:26.160626	2024-07-26 09:35:26.160626	50bcfea7-d580-41e0-a6e6-44be517cb0b9
f4906304-d805-4d30-817d-d7e2a8e310bc	Product5Category1	10	\N	f	2024-07-26 09:35:28.988127	2024-07-26 09:35:28.988127	50bcfea7-d580-41e0-a6e6-44be517cb0b9
\.


--
-- TOC entry 3346 (class 0 OID 16883)
-- Dependencies: 205
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, password, role, "createdAt") FROM stdin;
17bc041c-9b66-47f3-8bce-f3a13fc47620	Admin1	$2a$10$RZiC37mpxZhqhzIKEuX45ugW2VE/HMBlE2OG0NcUr4ug0WUtK7SyS	ADMIN	2024-07-25 10:43:08.56011
a277d2e3-9e83-4ea9-9948-3be90ad3cb15	User1	$2a$10$qW.16PJje3fdqF1ymWzhK.lb1N2o9YJ2yQn0zsdrKx.zDeVsLdo92	USER	2024-07-25 10:43:50.183476
\.


--
-- TOC entry 3349 (class 0 OID 16962)
-- Dependencies: 208
-- Data for Name: user_liked_products_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_liked_products_product ("userId", "productId") FROM stdin;
a277d2e3-9e83-4ea9-9948-3be90ad3cb15	2af6b331-d2e3-40ee-a025-8ddc990a03b0
a277d2e3-9e83-4ea9-9948-3be90ad3cb15	8eb2c29e-14b6-45b9-92a4-0298896d6828
\.


--
-- TOC entry 3190 (class 2606 OID 16874)
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- TOC entry 3178 (class 2606 OID 16820)
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 16935)
-- Name: cart_item PK_bd94725aa84f8cf37632bcde997; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY (id);


--
-- TOC entry 3182 (class 2606 OID 16834)
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- TOC entry 3186 (class 2606 OID 16850)
-- Name: cart PK_c524ec48751b9b5bcfbf6e59be7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 16892)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 16951)
-- Name: order_item PK_d01158fe15b1ead5c26fd7f4e90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 16966)
-- Name: user_liked_products_product PK_faba4f6b74fdd55bb0b5bded8fe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_products_product
    ADD CONSTRAINT "PK_faba4f6b74fdd55bb0b5bded8fe" PRIMARY KEY ("userId", "productId");


--
-- TOC entry 3188 (class 2606 OID 16852)
-- Name: cart REL_756f53ab9466eb52a52619ee01; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId");


--
-- TOC entry 3184 (class 2606 OID 16836)
-- Name: product UQ_22cc43e9a74d7498546e9a63e77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE (name);


--
-- TOC entry 3180 (class 2606 OID 16822)
-- Name: category UQ_23c05c292c439d77b0de816b500; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE (name);


--
-- TOC entry 3194 (class 2606 OID 16894)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 3199 (class 1259 OID 16968)
-- Name: IDX_84dc716602dd4662b7c88a078e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_84dc716602dd4662b7c88a078e" ON public.user_liked_products_product USING btree ("productId");


--
-- TOC entry 3200 (class 1259 OID 16967)
-- Name: IDX_c068ed98598f6fcb7a082299c5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c068ed98598f6fcb7a082299c5" ON public.user_liked_products_product USING btree ("userId");


--
-- TOC entry 3206 (class 2606 OID 16936)
-- Name: cart_item FK_29e590514f9941296f3a2440d39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES public.cart(id);


--
-- TOC entry 3208 (class 2606 OID 16952)
-- Name: order_item FK_646bf9ece6f45dbe41c203e06e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES public."order"(id);


--
-- TOC entry 3204 (class 2606 OID 16910)
-- Name: cart FK_756f53ab9466eb52a52619ee019; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3207 (class 2606 OID 16941)
-- Name: cart_item FK_75db0de134fe0f9fe9e4591b7bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- TOC entry 3210 (class 2606 OID 16974)
-- Name: user_liked_products_product FK_84dc716602dd4662b7c88a078e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_products_product
    ADD CONSTRAINT "FK_84dc716602dd4662b7c88a078e8" FOREIGN KEY ("productId") REFERENCES public.product(id);


--
-- TOC entry 3209 (class 2606 OID 16957)
-- Name: order_item FK_904370c093ceea4369659a3c810; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- TOC entry 3211 (class 2606 OID 16969)
-- Name: user_liked_products_product FK_c068ed98598f6fcb7a082299c54; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_products_product
    ADD CONSTRAINT "FK_c068ed98598f6fcb7a082299c54" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3205 (class 2606 OID 16925)
-- Name: order FK_caabe91507b3379c7ba73637b84; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3203 (class 2606 OID 16895)
-- Name: product FK_ff0c0301a95e517153df97f6812; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES public.category(id);


--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-08-07 19:22:11 CST

--
-- PostgreSQL database dump complete
--

