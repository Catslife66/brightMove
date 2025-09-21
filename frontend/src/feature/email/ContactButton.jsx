import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faContactBook } from "@fortawesome/free-solid-svg-icons";

const ContactButton = ({ property }) => {
  const email = property.contact_email;
  const subject = `Interested in ${property.address_line1} ${property.town} property`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div>
      <a
        href={mailtoLink}
        role="button"
        className="text-white mt-4 sm:mt-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faContactBook} className="mr-2" />
        Contact
      </a>
    </div>
  );
};

export default ContactButton;
