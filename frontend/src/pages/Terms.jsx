import { ChevronLeft, CircleHelp } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <section className="h-full overflow-y-auto bg-white rounded-lg p-6 md:p-14 lg:p-20 pt-32 lg:pt-16">
      <div className="flex items-center justify-between text-blue-600 text-lg mb-8">
        <ChevronLeft
          onClick={handleGoBack}
          className="cursor-pointer hover:opacity-70 transition-opacity duration-300"
        />
        <h1 className="font-bold text-xl">Terms of Use</h1>
        <CircleHelp className="text-white bg-gray-500 rounded-full" />
      </div>

      <div className="space-y-6 text-gray-800">
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-4">
            Welcome to Dagcoin Wallet
          </h2>
          <p className="mb-4">
            Dagcoin Wallet is your free, open-source digital wallet with
            multi-signature escrow capabilities. We've designed it to give you
            complete control over your digital assets.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-4">
            Your Wallet, Your Responsibility
          </h2>
          <ul className="space-y-4 list-disc pl-6">
            <li>
              Unlike a bank, your money isn't stored on our servers - it's
              safely encrypted on this device and other shared devices only
            </li>
            <li>
              You have full control over your passwords, private keys, and PINs
            </li>
            <li>
              Create a backup immediately after registration - it's essential
              for fund recovery
            </li>
            <li>* All transactions are permanent and cannot be reversed</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-4">Fees and Charges</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="font-semibold min-w-max lg:min-w-48 mr-2">
                  Platform Fee:
                </span>
                <span>
                  5% for transactions above £50,000
                  <ul className="mt-2 ml-4 text-sm text-gray-600">
                    <li>• 1% Network gas fee</li>
                    <li>• 2% Escrow merchant fee</li>
                    <li>• 2% Service fee</li>
                  </ul>
                  <br />
                  3.5% for transactions below £50,000
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-max lg:min-w-48 mr-2">
                  Network Fees:
                </span>
                <span>
                  Variable gas fees based on Ethereum and Bitcoin network
                  congestion
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-max lg:min-w-48 mr-2">
                  Special Cases:
                </span>
                <span>
                  Additional fees may apply for flagged or disputed accounts
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-4">Important Disclaimers</h2>
          <ul className="space-y-4 pl-6 list-disc">
            <li>
              While thoroughly tested, we cannot guarantee the software is
              entirely bug-free
            </li>
            <li>We cannot recover your private keys or passwords if lost</li>
            <li>
              We don't control the Dagcoin network or transaction confirmations
            </li>
            <li>The software is provided "as is" without warranties</li>
            <li>You accept all risks associated with using this software</li>
          </ul>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="font-semibold text-sm text-gray-600">
            We may update these terms periodically. By continuing to use Dagcoin
            Wallet, you agree to be bound by the most recent version of these
            terms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
