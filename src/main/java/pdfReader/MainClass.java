package pdfReader;

import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

public class MainClass {

	public static void main(String[] args) throws IOException {
		File pdfFile = new File(".\\Dictionary_of_Proverbs.pdf");
		PDDocument document = Loader.loadPDF(pdfFile);
		PDFTextStripper pdfStripper = new PDFTextStripper();
		String text = pdfStripper.getText(document);
		document.close();
		
		System.out.println(text);
	}
}

