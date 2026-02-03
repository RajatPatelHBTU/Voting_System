import { useState } from 'react';
import { PartySignInForm } from './PartySignInForm.tsx';
import { RegistrationForm } from './PartyRegistrationForm.tsx';

function PartyAuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {isRegistering ? (
        <div>
          <RegistrationForm setIsRegistering={setIsRegistering} />
        </div>
      ) : (
        <div>
          <PartySignInForm setIsRegistering={setIsRegistering} />
        </div>
      )}
    </div>
  );
}

export default PartyAuthPage;