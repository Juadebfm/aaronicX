import { ChevronLeft, CircleHelp } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <section className="h-full overflow-y-auto bg-white rounded-lg p-[20px] md:p-14 lg:p-20">
      <div className="flex items-center justify-between text-[#3038E5] text-[19px] mt-3">
        <ChevronLeft
          onClick={handleGoBack}
          className="cursor-pointer hover:opacity-70 transition-opacity duration-300"
        />
        <span className="block">Terms Of Use</span>
        <CircleHelp className="text-white bg-gray-500 rounded-full" />
      </div>
      <p className="font-light px-0 lg:px-5 mt-10 text-[#1E2240] space-y-5">
        <span className="block">
          Dagcoin wallet is a free, open source, multi-signature escrow digital
          wallet.
        </span>
        <span className="block">
          The software does not constitute an account where the developer of
          this software or any third party serves as a financial intermediary or
          a custodian of the coins, bytes or other valuables.
        </span>
        <span className="block">
          While the software has undergone beta testing and continues to be
          improved and further developed, we cannot guarantee that there will be
          no bugs in the software.
        </span>
        <span className="block">
          You acknowledge that Your use of this software is at Your discretion
          and in compliance with all applicable laws.
        </span>
        <span className="block">
          You are responsible for safekeeping Your passwords, private key pairs,
          PINs and any other codes You use to access the software.
        </span>
        <span className="block">
          If You lose access to Your Dagcoin wallet, You acknowledge and agree
          that any coins, bytes or other valuables You have associated with that
          Dagcoin wallet will become inaccessible.
        </span>
        <span className="block">
          If this device gets replaced or this app deleted, the funds in the
          wallet can be recovered only with a backup, which should be created
          right after installation.
        </span>
        <span className="block">
          All transaction requests are irreversible.
        </span>
        <span className="block">
          The authors of the software cannot retrieve your private keys or
          passwords if you lose or forget them and cannot guarantee transaction
          confirmation as they do not have control over the Dagcoin network.
        </span>
        <span className="block">
          To the fullest extent permitted by law, this software is provided “as
          is” and no representations or warranties can be made of any kind,
          express or implied, including but not limited to the warranties of
          merchantability, fitness for a particular purpose and noninfringement.
        </span>
        <span className="block">
          The funds are held securely on this device, not by the company.
        </span>
        <span className="block">
          In no event shall the developers of the software be liable for any
          claim, damages or other liability, whether in an action of contract,
          tort or otherwise, arising from, out of or in connection with the
          software or the use of the software.
        </span>
        <span className="block">
          You assume any and all risks associated with the use of the software.
        </span>
        <span className="block">
          We reserve the right to modify these terms from time to time.
        </span>
      </p>
    </section>
  );
};

export default Terms;
