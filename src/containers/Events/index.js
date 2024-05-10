import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9; // Nombre d'événements par page

const EventList = () => {
  const { data, error } = useData(); // Utilisation du hook useData pour obtenir les données et les erreurs
  const [type, setType] = useState(); // Déclaration d'un état pour la catégorie sélectionnée
  const [currentPage, setCurrentPage] = useState(1); // Déclaration d'un état pour la page actuelle

  // Filtrage des événements en fonction de la catégorie sélectionnée et de la pagination
  const filteredEvents = (
    (!type ? data?.events : data?.events.filter(event => event.type === type)) || []
  ).filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index && // Vérification de la limite inférieure de pagination
      PER_PAGE * currentPage > index // Vérification de la limite supérieure de pagination
    ) {
      return true; // Conserver l'événement dans la liste filtrée si les conditions sont remplies
    }
    return false; // Ne pas conserver l'événement sinon
  });


  // Fonction pour changer la catégorie sélectionnée
  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialiser la page actuelle à 1
    setType(evtType); // Mettre à jour la catégorie sélectionnée
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
