use serde::Deserialize;
use serde_xml_rs::from_reader;
use serde_xml_rs::Error;

#[derive(Debug, Deserialize)]
pub struct Opml {
    pub version: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct Head {
    pub title: Title,
    pub body: Body,
}

#[derive(Debug, Deserialize)]
pub struct Title {
    pub body: String,
}

#[derive(Debug, Deserialize)]
pub struct Body {
    pub body: Vec<Outline>,
}

#[derive(Debug, Deserialize)]
pub struct Outline {
    #[serde(rename = "type")]
    pub outline_type: Option<String>,
    pub text: Option<String>,
    pub title: Option<String>,
    #[serde(rename = "xmlUrl")]
    pub xml_url: Option<String>,
    #[serde(rename = "htmlUrl")]
    pub html_url: Option<String>,
    pub body: Vec<Outline>,
}

pub fn parse(content: &str) -> Result<Opml, Error> {
    let opml: Opml = from_reader(content.as_bytes())?;
    Ok(opml)
}
