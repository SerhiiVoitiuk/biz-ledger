import React from "react";
import path from "path";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import {
  convertToWeightString,
  convertToWords,
  formatPrice,
  formatQuantity,
  formatUkrainianDate,
  getInitial,
} from "@/lib/utils";

Font.register({
  family: "Manrope",
  fonts: [
    {
      src: path.resolve(process.cwd(), "public/fonts/Manrope-Regular.ttf"),
      fontWeight: "normal",
    },
    {
      src: path.resolve(process.cwd(), "public/fonts/Manrope-Bold.ttf"),
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    lineHeight: 1.3,
    fontFamily: "Manrope",
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
    fontFamily: "Manrope",
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
    fontFamily: "Manrope",
    fontWeight: "bold",
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
  driver,
  car,
}: {
  invoiceInfo: InvoiceById;
  driver: SupplierDriversById;
  car: SupplierCarsById;
}) => {
  const totalQuantity = invoiceInfo.specification.reduce((sum, item) => {
    return sum + parseFloat(item.quantity || "0");
  }, 0);

  const formatNumber = (value: number) => {
    return parseFloat(value.toFixed(6)).toString();
  };

  const units = invoiceInfo.specification.map((item) => item.unit);
  const firstUnit = units[0];

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
          <Text>
            Автомобіль {car.name} {car.registration}
          </Text>
          <Text>Причіп/напівпричіп ______________</Text>
          <Text>Вид перевезень _______________</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Автомобільний перевізник {car.owner} {car.ownerAddress}{" "}
          </Text>
          <Text>
            {driver.lastName} {getInitial(driver.firstName)}
            {getInitial(driver.middleName)}, {driver.driverLicense}
          </Text>
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
          <Text>
            отримав водій/експедитор {driver.lastName}{" "}
            {getInitial(driver.firstName)}
            {getInitial(driver.middleName)} (Водій)
          </Text>
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
            {formatUkrainianDate(invoiceInfo.data)} року
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
                style={[styles.tableBlock, { width: "20%", borderBottom: 0 }]}
              >
                Операція
              </Text>
              <Text
                style={[styles.tableBlock, { width: "16%", borderBottom: 0 }]}
              >
                Маса брутто, т
              </Text>
              <Text style={[styles.tableBlock, { width: "48%" }]}>
                Час (год. хв)
              </Text>
              <Text
                style={[styles.tableBlock, { width: "16%", borderBottom: 0 }]}
              >
                Підпис відповідальної особи
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[styles.tableBlock, { width: "20%", borderTop: 0 }]}
              ></Text>{" "}
              {/* rowspan */}
              <Text
                style={[styles.tableBlock, { width: "16%", borderTop: 0 }]}
              ></Text>{" "}
              {/* rowspan */}
              <Text style={[styles.tableBlock, { width: "16%" }]}>
                прибуття
              </Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>вибуття</Text>
              <Text style={[styles.tableBlock, { width: "16%" }]}>простою</Text>
              <Text
                style={[styles.tableBlock, { width: "16%", borderTop: 0 }]}
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
