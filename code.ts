// @ts-nocheck

figma.showUI(__html__);
figma.ui.resize(300, 500);

import { getDate } from "./src/utils";

const today = getDate();

function setText(instance, nodeName: string, characters: string) {
  const cellText = instance.findOne(
    (node) => node.name === nodeName && node.type === "TEXT"
  );
  cellText.characters = characters;
}

figma.ui.onmessage = ({ type, version, details }) => {
  const loadFonts = async () => {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  };

  loadFonts()
    .then(() => {
      if (type === "release-note") {
        const row = figma.root.findOne(
          (node) => node.name === ".DS-row-note" && node.type === "COMPONENT"
        );
        const rowInstance = row.createInstance();

        setText(rowInstance, "Date", `${today}`);
        setText(rowInstance, "Version", `${version}`);
        setText(rowInstance, "Details", `${details}`);

        let releaseDetails = figma.currentPage.findOne(
          (node) =>
            node.name === ".DS-release-notes" && node.type !== "COMPONENT"
        );
        if (releaseDetails) {
          if (releaseDetails.type === "INSTANCE") {
            releaseDetails = releaseDetails.detachInstance();
          }
          releaseDetails.insertChild(1, rowInstance);
          
        } else {
          figma.notify(
            "Please, add instance of '.DS-release-notes' components to this page"
          );
        }
      }
    })
    .finally(() => figma.closePlugin());
};
