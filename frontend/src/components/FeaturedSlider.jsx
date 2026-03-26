import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

export default function FeaturedSlider({ products }) {

  if (!products || products.length === 0) return null;

  return (

    <div className="section">

      <div className="slider-header">
        <h2 className="section-title">Featured Products</h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={12}
        loop={true}

        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}

        navigation

        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          480: {
            slidesPerView: 2.2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          }
        }}
      >

        {products.map((p) => (
          <SwiperSlide key={p._id}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}

      </Swiper>

    </div>

  );
}