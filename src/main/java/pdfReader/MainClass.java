package pdfReader;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

public class MainClass {

	public static void main(String[] args) throws IOException {
        boolean txtReaderMode = true;
        if (txtReaderMode) {
            txtReader();
        } else {
            File pdfFile = new File(".\\Dictionary_of_Proverbs.pdf");
            PDDocument document = Loader.loadPDF(pdfFile);
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            document.close();

            PrintWriter writer = new PrintWriter("sayings.txt", "UTF-8");
            writer.println(text);
            writer.close();
        }
	}

    static void txtReader() {
        String fileName = "sayings/african.txt";
        try(BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                line = br.readLine();
            }
            String everything = sb.toString();
            System.out.println(everything);
        } catch(IOException e) { }
    }
}

