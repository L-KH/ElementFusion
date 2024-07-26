import { useCallback, useEffect, useState } from "react";
import { recoverMessageAddress, type Address } from "viem";
import { useSignMessage } from "wagmi";

type AlchemyElement = {
  id: number;
  name: string;
  imagePath: string;
  rarity: string;
};

export function useSignMessageHook() {
  const [recoveredAddress, setRecoveredAddress] = useState<Address>();
  const { data: signature, variables, error, isPending, signMessage } = useSignMessage();

  const recoverAddress = useCallback(async () => {
    if (variables?.message && signature) {
      try {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature,
        });
        setRecoveredAddress(recoveredAddress);
      } catch (err) {
        console.error('Error recovering address:', err);
      }
    }
  }, [signature, variables?.message]);

  useEffect(() => {
    recoverAddress();
  }, [recoverAddress]);

  const saveElements = async (elements: AlchemyElement[]) => {
    try {
      const message = JSON.stringify(elements);
      await signMessage({ message });
      console.log('Elements saved successfully:', elements);
    } catch (err) {
      console.error('Error saving elements:', err);
    }
  };

  return { signature, recoveredAddress, error, isPending, signMessage, saveElements };
}
