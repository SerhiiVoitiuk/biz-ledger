import React from "react";
import path from "path";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import { formatPrice, formatQuantity, formatUkrainianDate } from "@/lib/utils";

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
    backgroundColor: "#fff",
    fontFamily: "Manrope",
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
  totalRow: {
    flexDirection: "row",
    fontSize: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    fontSize: 10,
    fontFamily: "Manrope",
    fontWeight: "bold",
  },
});

const PrintableInvoice = ({ invoiceInfo }: { invoiceInfo: InvoiceById }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* Supplier Info */}
        <View style={[styles.supplierSection, { flex: 2, paddingRight: 10 }]}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 8, fontWeight: "bold" }}>
              Постачальник: {invoiceInfo.supplierName}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Адреса: </Text>
              {invoiceInfo.supplierAddress}
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ fontSize: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Р/pахунок: </Text>
              {invoiceInfo.supplierBankAccount}
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ fontSize: 8 }}>
              <Text style={{ fontWeight: "bold" }}>ЄДРПОУ: </Text>
              {invoiceInfo.supplierEDRPOU}
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ fontSize: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Тел./ф.: </Text>
              {invoiceInfo.supplierPhoneNumber}
            </Text>
          </View>
        </View>

        {/* Invoice Info */}
        <View
          style={[styles.supplierSection, { flex: 1, alignItems: "center" }]}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Накладна
          </Text>
          <Text style={{ fontSize: 8, marginTop: 5 }}>
            № {invoiceInfo.number}
          </Text>
          <Text style={{ fontSize: 8, marginTop: 5 }}>
            від {formatUkrainianDate(invoiceInfo.data)} року
          </Text>
        </View>
      </View>

      {/* Center */}
      <View style={styles.recipientSection}>
        <View style={{ marginTop: 3 }}>
          <Text style={{ fontSize: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Одержувач: </Text>
            {invoiceInfo.institutionName} ({invoiceInfo.deliveryAddress})
          </Text>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={{ fontSize: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Платник: </Text>
            {invoiceInfo.customerName}
          </Text>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={{ fontSize: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Підстава: </Text>
            Договір № {invoiceInfo.contractNumber} від{" "}
            {invoiceInfo.contractData}
          </Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Header */}
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.tableHeader, { width: "10%" }]}>№</Text>
          <Text style={[styles.tableHeader, { width: "30%" }]}>
            Найменування товару
          </Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>
            Одиниця виміру
          </Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Кількість</Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Ціна</Text>
          <Text style={[styles.tableHeader, { width: "15%" }]}>Сума</Text>
        </View>

        {/* Rows */}
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

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={[styles.tableCell, { width: "55%" }]}></Text>
          <Text
            style={[styles.tableCell, { width: "30%", fontWeight: "bold" }]}
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
            style={[styles.tableCell, { width: "30%", fontWeight: "bold" }]}
          >
            ПДВ20%:
          </Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>00,00</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.tableCell, { width: "55%" }]}></Text>
          <Text
            style={[styles.tableCell, { width: "30%", fontWeight: "bold" }]}
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
