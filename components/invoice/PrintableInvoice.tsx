import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import { formatPrice, formatQuantity, formatUkrainianDate } from "@/lib/utils";

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
    backgroundColor: "#fff",
    fontFamily: 'Manrope-Regular',
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  supplierSection: {
    flexDirection: "column",
  },
  recipientSection: {
    flexDirection: "column",
    textAlign: "left",
    marginBottom: 20,
  },
  table: {
    borderStyle: "solid",
    borderWidth: 0.2,
    borderColor: "#1f2124",
    marginBottom: 20,
    width: "100%",
  },
  tableHeader: {
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
  totalRow: {
    flexDirection: "row",
    fontSize: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    fontSize: 10,
    fontFamily: "Manrope-Bold",
  },
});

const PrintableInvoice = ({ invoiceInfo }: { invoiceInfo: InvoiceById }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* Supplier Info - LEFT */}
        <View style={[styles.supplierSection, { flex: 2, paddingRight: 10 }]}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
              Постачальник:{" "}
            </Text>
            <Text
              style={{
                fontSize: 8,
                flexShrink: 1,
                fontFamily: "Manrope-Bold",
              }}
            >
              {invoiceInfo.supplierName}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 8 }}>
              <Text style={{ fontFamily: "Manrope-Bold" }}>Адреса: </Text>
              <Text style={{ fontSize: 8 }}>{invoiceInfo.supplierAddress}</Text>
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
              Р/pахунок:{" "}
            </Text>
            <Text style={{ fontSize: 8, flexShrink: 1 }}>
              {invoiceInfo.supplierBankAccount}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
              ЄДРПОУ:{" "}
            </Text>
            <Text style={{ fontSize: 8, flexShrink: 1 }}>
              {invoiceInfo.supplierEDRPOU}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
              Тел./ф.:{" "}
            </Text>
            <Text style={{ fontSize: 8, flexShrink: 1 }}>
              {invoiceInfo.supplierPhoneNumber}
            </Text>
          </View>
        </View>

        {/* Invoice Info - RIGHT */}
        <View
          style={[styles.supplierSection, { flex: 1, alignItems: "center" }]}
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Manrope-Bold",
              textAlign: "center",
              textTransform: 'uppercase',
            }}
          >
            Накладна
          </Text>
          <Text style={{ fontSize: 8, marginTop: 5, textAlign: "center", }}>
            № {invoiceInfo.number}
          </Text>
          <Text style={{ fontSize: 8, marginTop: 5, textAlign: "center" }}>
            від {formatUkrainianDate(invoiceInfo.data)} року
          </Text>
        </View>
      </View>

      {/* Center */}
      <View style={styles.recipientSection}>
        <View style={{ marginTop: 3 }}>
          <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
            <Text>Одержувач: </Text>
            <Text style={{ fontFamily: "Manrope-Regular", fontSize: 8 }}>
              {invoiceInfo.institutionName} ({invoiceInfo.deliveryAddress})
            </Text>
          </Text>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
            <Text>Платник: </Text>
            <Text style={{ fontFamily: "Manrope-Regular", fontSize: 8 }}>
              {invoiceInfo.customerName}
            </Text>
          </Text>

          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 8, fontFamily: "Manrope-Bold" }}>
              <Text>Підстава: </Text>
              <Text style={{ fontFamily: "Manrope-Regular", fontSize: 8 }}>
                Договір № {invoiceInfo.contractNumber} від {" "}
                {invoiceInfo.contractData}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.tableHeader, { width: "10%" }]}>№</Text>
          <Text style={[styles.tableHeader, { width: "30%" }]}>
            Найменування товару
          </Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Одиниця виміру</Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Кількість</Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Ціна</Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Сума</Text>
        </View>

        {/* Table Rows */}
        {invoiceInfo.specification.map((item, index) => (
          <View style={{ flexDirection: "row" }} key={item.id || index}>
            <Text style={[styles.tableCell, { width: "10%" }]}>
              {index + 1}
            </Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {item.productName}
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              {item.unit}
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              {formatQuantity(item.quantity)}
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              {formatPrice(item.pricePerUnit)}
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              {formatPrice(item.sum as number)}
            </Text>
          </View>
        ))}
        {/* Total Rows*/}
        <View style={styles.totalRow}>
          <Text style={[styles.tableCell, { width: "55%" }]}></Text>
          <Text
            style={[
              styles.tableCell,
              { width: "30%", fontFamily: "Manrope-Bold", textAlign: "left" },
            ]}
          >
            Разом
          </Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>
            {formatPrice(invoiceInfo.totalAmount as number)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.tableCell, { width: "55%" }]}></Text>
          <Text
            style={[
              styles.tableCell,
              { width: "30%", fontFamily: "Manrope-Bold", textAlign: "left" },
            ]}
          >
            ПДВ20%:
          </Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>00,00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.tableCell, { width: "55%" }]}></Text>
          <Text
            style={[
              styles.tableCell,
              { width: "30%", fontFamily: "Manrope-Bold", textAlign: "left" },
            ]}
          >
            Всього з ПДВ:
          </Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>
            {formatPrice(invoiceInfo.totalAmount as number)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Відправник: ______________</Text>
        <Text>Одержувач: ______________</Text>
      </View>
    </Page>
  </Document>
);

export default PrintableInvoice;
