
import { jsPDF } from "jspdf";

const RobotoBase64 = "AAEAAAARAQAABA...=="; // (Giả lập cắt ngắn để minh họa)

jsPDF.API.events.push(["addFonts", function () {
    this.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
    this.addFont("Roboto-Regular.ttf", "Roboto", "normal");
}]);
