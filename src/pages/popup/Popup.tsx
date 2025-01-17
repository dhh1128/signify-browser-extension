import React, { useState, useEffect } from "react";
import { IMessage } from "@pages/background/types";
import { Signin } from "@src/screens/signin";
import { Loader } from "@components/loader";
import { Main } from "@components/main";

// TODO Harcoded for initial development. Will be removed soon
const url = "https://keria-dev.rootsid.cloud/admin";
const boot_url = "https://keria-dev.rootsid.cloud";
const password = "CqjYb60NT9gZl8itwuttD9";

interface IConnect {
  passcode?: string;
  vendorUrl?: string;
  bootUrl?: string;
}

export default function Popup(): JSX.Element {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingInitialConnection, setIsCheckingInitialConnection] =
    useState(false);

  const checkInitialConnection = async () => {
    setIsCheckingInitialConnection(true);
    await checkConnection();
    setIsCheckingInitialConnection(false);
  };

  const checkConnection = async () => {
    const { data } = await chrome.runtime.sendMessage<IMessage<void>>({
      type: "authentication",
      subtype: "check-agent-connection",
    });

    setIsConnected(!!data.isConnected);
    if (data.isConnected) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 1) {
          console.log("realoading tab");
          chrome.tabs.sendMessage(tabs[0].id!, {
            type: "tab",
            subtype: "reload-state",
          });
        }
      });
    }
  };

  useEffect(() => {
    checkInitialConnection();
  }, []);

  const handleConnect = async (passcode?: string) => {
    setIsLoading(true);
    await chrome.runtime.sendMessage<IMessage<IConnect>>({
      type: "authentication",
      subtype: "connect-agent",
      data: {
        passcode: password,
        // TODO: vendorUrl willbe fetched by config service
        // const vendorUrl = await configService.getUrl()
        vendorUrl: url,
        bootUrl: boot_url,
      },
    });
    await checkConnection();
    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    await chrome.runtime.sendMessage<IMessage<void>>({
      type: "authentication",
      subtype: "disconnect-agent",
    });
    checkConnection();
  };

  if (isCheckingInitialConnection) {
    return (
      <div className="w-[300px]">
        <div className=" w-16 h-16 m-auto text-green">
          <Loader size={12} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {isConnected ? (
        <Main handleDisconnect={handleDisconnect} />
      ) : (
        <div className="w-[300px]">
          <Signin handleConnect={handleConnect} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
