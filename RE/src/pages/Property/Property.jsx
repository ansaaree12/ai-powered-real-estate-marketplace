import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart, AiTwotoneCar } from "react-icons/ai";
import { FaShower, FaFilePdf } from "react-icons/fa";
import { MdLocationPin, MdMeetingRoom, MdHomeWork, MdOutlineLocalOffer } from "react-icons/md";
import { BsRulers } from "react-icons/bs";
import Map from "../../components/Map/Map";
import { propertyToVirtualTourMap } from "../../utils/virtualTourMapping";
import VirtualTour from "../../virtualTour/virtualTour";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import "./Property.css";

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));
  const [modalOpened, setModalOpened] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));
      toast.success("Booking cancelled", { position: "bottom-right" });
    },
  });

  const handleBrochureClick = () => {
    const pdfUrl = `/brochures/property-${id}.pdf`;
    window.open(pdfUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching the property details</span>
        </div>
      </div>
    );
  }

  const virtualTourFolder = propertyToVirtualTourMap[id];

  const amenitiesList = data?.amenities ? 
    (Array.isArray(data.amenities) ? data.amenities : data.amenities.split(',').map(item => item.trim())) 
    : [];

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        <div className="like">
          <Heart id={id} />
        </div>

        <img src={data?.image} alt="home image" />

        <div className="flexCenter property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data?.title}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
              ₹  {data?.price}
              </span>
            </div>


            <div className="flexStart facilities">
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings} Parking</span>
              </div>
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} Room/s</span>
              </div>
              {data?.size && data.size !== "null" && (
                <div className="flexStart facility">
                  <BsRulers size={20} color="#1F3E72" />
                  <span>{data.size}</span>
                </div>
              )}
            </div>

            <div className="flexStart info-row">
              {data?.TypeofHouse && (
                <div className="flexStart info-item">
                  <MdHomeWork size={20} color="#1F3E72" />
                  <span>&nbsp;Type: &nbsp;{data.TypeofHouse}</span>
                </div>
              )}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

              {amenitiesList.length > 0 && (
                <div className="flexStart info-item">
                  <MdOutlineLocalOffer size={20} color="#1F3E72" />
                  <span>&nbsp;Amenities: &nbsp;{amenitiesList.join(', ')}</span>
                </div>
              )}
            </div>

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>

            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                  variant="outline"
                  w={"100%"}
                  color="red"
                  onClick={() => cancelBooking()}
                  disabled={cancelling}
                >
                  <span>Cancel booking</span>
                </Button>
                <span>
                  Your visit already booked for date{" "}
                  {bookings?.find((booking) => booking?.id === id)?.date}
                </span>
              </>
            ) : (
              <button
                className="button"
                onClick={() => {
                  validateLogin() && setModalOpened(true);
                }}
              >
                Book your visit
              </button>
            )}

            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />

            {virtualTourFolder && (
              <button
                className="button virtual-tour-button"
                onClick={() => setShowVirtualTour(true)}
              >
                View Virtual Tour
              </button>
            )}
          </div>

          <div className="map">
            <Map address={data?.address} city={data?.city} country={data?.country} />
          </div>
        </div>

        {showVirtualTour && virtualTourFolder && (
          <VirtualTour
            virtualTourFolder={virtualTourFolder}
            onClose={() => setShowVirtualTour(false)}
          />
        )}

        {data?.gallery && data.gallery.length > 0 && (
          <div className="gallery-section">
            <h3>Gallery</h3>
            <div className="gallery-images">
              {data.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`property image ${index + 1}`}
                  className="gallery-image"
                  onClick={() => {
                    setSelectedImage(image);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {showModal && selectedImage && (
          <div className="image-modal" onClick={() => setShowModal(false)}>
            <div className="modal-content">
              <img
                src={selectedImage}
                alt="Zoomed-in"
                className="zoomed-image"
              />
            </div>
          </div>
        )}

        
<button
              onClick={handleBrochureClick}
              className="brochure-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#4066ff',
                color: 'white',
                padding: '0.6rem 1rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1rem',
                fontSize: '0.9rem'
              }}
            >
              <FaFilePdf size={20} />
              View Property Brochure
            </button>
      </div>
    </div>
  );
};

export default Property;