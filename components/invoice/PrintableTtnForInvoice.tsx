import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import {
  convertToWeightString,
  convertToWords,
  formatPrice,
  formatQuantity,
  formatUkrainianDate,
} from "@/lib/utils";

Font.register({
  family: "Manrope-Regular",
  src: "public/fonts/Manrope-Regular.ttf",
});

Font.register({
  family: "Manrope-Bold",
  src: "public/fonts/Manrope-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    lineHeight: 1.3,
    fontFamily: "Manrope-Regular",
  },
  docNote: {
    marginLeft: "auto",
    width: 200,
    marginBottom: 14,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 14,
    textTransform: "uppercase",
    fontFamily: "Manrope-Bold",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  table: {
    borderStyle: "solid",
    borderWidth: 0.2,
    borderColor: "#1f2124",
    marginBottom: 5,
    width: "100%",
  },
  tableBlock: {
    textAlign: "center",
    padding: 3,
    fontSize: 8,
    fontFamily: "Manrope-Bold",
    borderStyle: "solid",
    borderWidth: 0.2,
    borderColor: "#1f2124",
  },
  tableCell: {
    textAlign: "center",
    padding: 3,
    fontSize: 8,
    borderStyle: "solid",
    borderWidth: 0.2,
    borderColor: "#1f2124",
  },
});

const PrintableTtnForInvoice = ({
  invoiceInfo,
  vehicleName = "Renault",
}: {
  invoiceInfo: InvoiceById;
  vehicleName: string;
}) => {
  const totalQuantity = invoiceInfo.specification.reduce((sum, item) => {
    return sum + parseFloat(item.quantity || "0");
  }, 0);

  const formatNumber = (value: number) => {
    return parseFloat(value.toFixed(6)).toString();
  };

  const units = invoiceInfo.specification.map((item) => item.unit);
  const firstUnit = units[0];

  let driverWithLicence;

  switch (invoiceInfo.supplierEDRPOU) {
    case "2932924478":
      driverWithLicence = "Сімєнков Є.М., ВАЕ 622702";
      break;
    case "3884910877":
      driverWithLicence = "Лопатовський П.Р., ВАЕ 622702";
      break;
    default:
      driverWithLicence = "______________________";
      break;
  }

  let driverWithPosition;

  switch (invoiceInfo.supplierEDRPOU) {
    case "2932924478":
      driverWithPosition = "Сімєнков Є.М. (водій)";
      break;
    case "3884910877":
      driverWithPosition = "Лопатовський П.Р. (водій)";
      break;
    default:
      driverWithPosition = "______________________";
      break;
  }

  let loadPlace;

  switch (invoiceInfo.supplierEDRPOU) {
    case "2932924478":
      loadPlace = "м.Хмельницький, вул Курчатова, буд.8/9А";
      break;
    case "3884910877":
      loadPlace = "м.Хмельницький, вул Камянецька, буд.122";
      break;
    default:
      loadPlace = "_________________________________________________";
      break;
  }

  let vehicle;
  let vehicleOwner;

  if (
    invoiceInfo.supplierEDRPOU === "2932924478" ||
    invoiceInfo.supplierEDRPOU === "3884910877"
  ) {
    vehicle =
      vehicleName === "Renault"
        ? "RENAULT MASTER ВХ 7258 HК"
        : "Peugeot Partner ВХ 3754 СІ";
    vehicleOwner =
      vehicleName === "Renault"
        ? "Сімєнкова Ірина Вікторівна, м.Хмельницький, вул. Зарічанська, буд.14-А"
        : "Сімєнков  Євгеній  Миколайович, с. Давидківці, вул. Лісова, будинок 52";
  } else {
    vehicle = "______________________";
    vehicleOwner = "______________________";
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.docNote}>
          <Text style={{ textAlign: "left", fontSize: 12 }}>Додаток 7</Text>
          <Text style={{ textAlign: "left", fontSize: 12 }}>
            до Правил перевезень вантажів
          </Text>
          <Text style={{ textAlign: "left", fontSize: 12 }}>
            автомобільним транспортом в Україні
          </Text>
          <Text style={{ textAlign: "left", fontSize: 12 }}>
            (пункт 11.1 глави 11)
          </Text>
        </View>
        <View>
          <Text style={styles.title}>ТОВАРНО-ТРАНСПОРТНА НАКЛАДНА</Text>
          <Text style={styles.title}>
            № ___ від "___" ___________ 20__ року
          </Text>
        </View>
        <View style={styles.docNote}>
          <Text style={{ textAlign: "right" }}>Форма № 1-ТН</Text>
        </View>
        <View style={styles.section}>
          <Text>Автомобіль {vehicle}</Text>
          <Text>Причіп/напівпричіп ______________</Text>
          <Text>Вид перевезень _______________</Text>
        </View>
        <View style={styles.section}>
          <Text>Автомобільний перевізник {vehicleOwner} </Text>
          <Text>{driverWithLicence}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Вантажовідправник {invoiceInfo.supplierName}{" "}
            {invoiceInfo.supplierAddress}
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            Вантажоодержувач{" "}
            {invoiceInfo.institutionName === invoiceInfo.customerName ? (
              <>
                {invoiceInfo.institutionName} ({invoiceInfo.deliveryAddress})
              </>
            ) : (
              <>
                {invoiceInfo.customerName} ({invoiceInfo.institutionName}){" "}
                {invoiceInfo.deliveryAddress}
              </>
            )}
          </Text>
        </View>
        <View style={styles.section}>
          <Text>Пункт навантаження {loadPlace} </Text>
        </View>
        <View style={styles.section}>
          <Text>Пункт розвантаження {invoiceInfo.deliveryAddress}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            кількість місць {convertToWeightString(totalQuantity, firstUnit)}
          </Text>
          <Text>отримав водій/експедитор {driverWithPosition}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Усього відпущено на загальну суму{" "}
            {convertToWords(invoiceInfo.totalAmount as number)}. Без ПДВ
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            Супровідні документи на вантаж накладна №{invoiceInfo.number} від{" "}
            {formatUkrainianDate(invoiceInfo.data)}
          </Text>
        </View>
      </Page>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.docNote}>
          <Text style={{ textAlign: "right", fontSize: 12 }}>
            Зворотний бік
          </Text>
        </View>
        <View>
          <Text style={styles.title}>ВІДОМОСТІ ПРО ВАНТАЖ</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.tableBlock, { width: "4%" }]}>№ з/п</Text>
            <Text style={[styles.tableBlock, { width: "40%" }]}>
              Найменування вантажу (номер контейнера), у разі перевезення
              небезпечних вантажів: клас небезпечних речовин, до якого віднесено
              вантаж
            </Text>
            <Text style={[styles.tableBlock, { width: "7%" }]}>
              Одиниця виміру
            </Text>
            <Text style={[styles.tableBlock, { width: "7%" }]}>
              Кількість місць
            </Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>
              Ціна без ПДВ за одиницю, грн
            </Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>
              Загальна сума без ПДВ, грн
            </Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>
              Вид пакування
            </Text>
            <Text style={[styles.tableBlock, { width: "15%" }]}>
              Документи з вантажем
            </Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>
              Маса брутто, т
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.tableBlock, { width: "4%" }]}>1</Text>
            <Text style={[styles.tableBlock, { width: "40%" }]}>2</Text>
            <Text style={[styles.tableBlock, { width: "7%" }]}>3</Text>
            <Text style={[styles.tableBlock, { width: "7%" }]}>4</Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>5</Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>6</Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>7</Text>
            <Text style={[styles.tableBlock, { width: "15%" }]}>8</Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>9</Text>
          </View>
          {/* Table Rows */}
          {invoiceInfo.specification.map((item, index) => (
            <View style={{ flexDirection: "row" }} key={item.id || index}>
              <Text style={[styles.tableCell, { width: "4%" }]}>
                {index + 1}
              </Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>
                {item.productName}
              </Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>
                {item.unit}
              </Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>
                {formatQuantity(item.quantity)}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {formatPrice(item.pricePerUnit)}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {formatPrice(item.sum as number)}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}></Text>
              <Text style={[styles.tableCell, { width: "15%" }]}></Text>
              <Text style={[styles.tableCell, { width: "10%" }]}></Text>
            </View>
          ))}
          {/* Table Footer */}
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.tableBlock, { width: "44%" }]}>Усього:</Text>
            <Text style={[styles.tableBlock, { width: "7%" }]}>Х</Text>
            <Text style={[styles.tableBlock, { width: "7%" }]}>
              {formatNumber(totalQuantity)}
            </Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>Х</Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}>
              {formatPrice(invoiceInfo.totalAmount as number)}
            </Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}></Text>
            <Text style={[styles.tableBlock, { width: "15%" }]}></Text>
            <Text style={[styles.tableBlock, { width: "10%" }]}></Text>
          </View>
        </View>

        <View style={{ ...styles.section, marginBottom: 5 }}>
          <Text style={{ textAlign: "center" }}>
            Здав (відповідальна особа вантажовідправника)
          </Text>
          <Text style={{ textAlign: "center" }}>
            Прийняв (відповідальна особа вантажоодержувача)
          </Text>
        </View>
        <View style={{ ...styles.section, marginBottom: 5 }}>
          <Text style={{ marginLeft: 25 }}>
            {invoiceInfo.supplierName} __________
          </Text>
          <Text style={{ marginRight: 25 }}>
            ______________________________
          </Text>
        </View>
        <View style={{ ...styles.section, marginBottom: 5 }}>
          <Text style={{ marginLeft: 75 }}>(П.І.Б., посада, підпис)</Text>
          <Text style={{ marginRight: 75 }}>(П.І.Б., посада, підпис)</Text>
        </View>

        <View wrap={false}>
          <Text style={styles.title}>ВАНТАЖНО-РОЗВАНТАЖУВАЛЬНІ ОПЕРАЦІЇ</Text>

          <View style={styles.table}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.tableBlock,
                  { width: "20%", borderBottom: "none" },
                ]}
              >
                Операція
              </Text>
              <Text
                style={[
                  styles.tableBlock,
                  { width: "16%", borderBottom: "none" },
                ]}
              >
                Маса брутто, т
              </Text>
              <Text style={[styles.tableBlock, { width: "48%" }]}>
                Час (год. хв)
              </Text>
              <Text
                style={[
                  styles.tableBlock,
                  { width: "16%", borderBottom: "none" },
                ]}
              >
                Підпис відповідальної особи
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[styles.tableBlock, { width: "20%", borderTop: "none" }]}
              ></Text>{" "}
              {/* rowspan */}
              <Text
                style={[styles.tableBlock, { width: "16%", borderTop: "none" }]}
              ></Text>{" "}
              {/* rowspan */}
              <Text style={[styles.tableBlock, { width: "16%" }]}>
                прибуття
              </Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>вибуття</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>простою</Text>
              <Text
                style={[styles.tableBlock, { width: "16%", borderTop: "none" }]}
              ></Text>{" "}
              {/* rowspan */}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.tableBlock, { width: "20%" }]}>10</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>11</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>12</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>13</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>14</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>15</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.tableBlock, { width: "20%" }]}>
                Навантаження
              </Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.tableBlock, { width: "20%" }]}>
                Розвантаження
              </Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}></Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PrintableTtnForInvoice;
