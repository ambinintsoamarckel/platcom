import React from 'react';
import { Carousel, CarouselItem ,CarouselCaption} from 'react-bootstrap';

const Znt = ({ photos, onUpdate, onDelete }) => {
  return (
    <Carousel>
      {photos.map((photo, index) => (
        <CarouselItem key={index}>
        <img src={URL.createObjectURL(photo)} alt={`Image ${index + 1}`} />
{          <CarouselCaption>
            <p>Image {index + 1}</p>
            <div>
              {/* Bouton pour la suppression */}
              <button onClick={() => onDelete(index)}>Supprimer</button>
            </div>
          </CarouselCaption>}
        </CarouselItem>
      ))}
    </Carousel>
  );
};

export default Znt;

