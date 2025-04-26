import { useState } from "react";
import CaseStudyDataModal from "../components/CaseStudyDataModal";

function SaveTheCodePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleContinue = () => {
    console.log("User clicked continue!");
    setIsModalOpen(false);
  };

  const mcasBody = (
    <div className="text-white">
      <p className="mb-4 ">
        The Maneuvering Characteristics Augmentation System (MCAS) was a flight
        control system designed to automatically correct the angle of attack
        (AoA) of the Boeing 737 MAX aircraft. However, due to a flaw in the
        system's design and implementation, it caused two catastrophic crashes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Lion Air Flight 610 (October 2018)</li>
        <li>Ethiopian Airlines Flight 302 (March 2019)</li>
      </ul>
      <p className="mb-4">
        The MCAS relied on a single angle-of-attack sensor, and a faulty reading
        caused the system to repeatedly push the nose of the aircraft down,
        leading to a loss of control. The lack of redundancy and inadequate
        pilot training contributed to these tragedies.
      </p>
      <p>Below are images of the incidents:</p>
    </div>
  );

  const mcasImages = ["/images/mcas1.jpg", "/images/mcas2.png"];

  return (
    <div className="mt-100">
      <div>Open modal</div>
      <CaseStudyDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="MCAS: A Catastrophic Failure"
        body={mcasBody}
        images={mcasImages}
        buttonText="Read More"
        onContinue={handleContinue}
      />
    </div>
  );
}

export default SaveTheCodePage;
