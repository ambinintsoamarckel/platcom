    import React from 'react';
    import { Carousel } from 'react-responsive-carousel';
    import 'react-responsive-carousel/lib/styles/carousel.min.css';


    const MyCarousel = ({ images }) => {
    const renderCustomPrevButton = (clickHandler, hasPrev, label) => (
        <button
        onClick={clickHandler}
        title={label}
        style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            zIndex: 2,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
        }}
        >
        Prev
        </button>
    );

    const renderCustomNextButton = (clickHandler, hasNext, label) => (
        <button
        onClick={clickHandler}
        title={label}
        style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            zIndex: 2,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
        }}
        >
        Next
        </button>
    );

    return (
        <Carousel
        renderArrowPrev={renderCustomPrevButton}
        renderArrowNext={renderCustomNextButton}
        >
        {images.map((image, index) => (
            <div key={index}>
            <img src={image.src} alt={image.alt} />
            <span>fory {index} {image.src} </span>
            </div>
        ))}
        </Carousel>
    );
    };

    export default MyCarousel;
