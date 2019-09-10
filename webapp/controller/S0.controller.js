sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("ovly.odata.controller.S0", {
		onInit: function () {
			this._list = this.byId("list"); // sap.m.List
			this._modelo = this.getOwnerComponent().getModel("fonte"); // v2.ODataModel
		},

		onSave: function () {
			function onSuccess(oProdutoCriado, resposta) {
				MessageToast.show("Produto Criado com ID " + oProdutoCriado.ID);
			}

			function onError(oErro) {
				MessageBox.error(oErro);
			}

			var oNovoProduto = {
				ID: this.byId("produto_id").getValue(),
				Name: this.byId("produto_nome").getValue(),
				Description: this.byId("produto_descricao").getValue()
			};

			var oParameters = {
				success: onSuccess,
				error: onError
			};

			this._modelo.create("/Products", oNovoProduto, oParameters);
		},

		onUpdate: function () {
			function onSuccess(resposta) {
				MessageToast.show("Produto Atualizado");
			}

			function onError(oErro) {
				MessageBox.error(oErro);
			}

			var oNovoProduto = {
				ID: this.byId("produto_id").getValue(),
				Name: this.byId("produto_nome").getValue(),
				Description: this.byId("produto_descricao").getValue()
			};

			var oParameters = {
				success: onSuccess,
				error: onError
			};

			var sPath = this._modelo.createKey("/Products", {
				ID: oNovoProduto.ID
			});
			this._modelo.update(sPath, oNovoProduto, oParameters);
		},

		onDelete: function (oEvent) {
			function onSuccess(resposta) {
				MessageToast.show("Produto Deletado");
			}

			function onError(oErro) {
				MessageBox.error(oErro);
			}
			
			var oParameters = oEvent.getParameters();
			var oListItem = oParameters.listItem;
			var oListItemContext = oListItem.getBindingContext("fonte");
			var sPath = oListItemContext.getPath();
			
			var oSettings = {
				success: onSuccess,
				error: onError
			};
			
			this._modelo.remove(sPath, oSettings);
				
		},

			onItemPress: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oListItem = oParameters.listItem;
			var oListItemContext = oListItem.getBindingContext("fonte");

			this.byId("produto_id").setValue(oListItemContext.getProperty("ID"));
			this.byId("produto_nome").setValue(oListItemContext.getProperty("Name"));
			this.byId("produto_descricao").setValue(oListItemContext.getProperty("Description"));
		},

		onSearch: function (oEvent) {
			var oListBinding = this._list.getBinding("items");
			var sQuery = oEvent.getParameters().query;

			if (sQuery === "") {
				oListBinding.filter();
			} else {
				var oFilter = new sap.ui.model.Filter({
					path: "Name",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sQuery
				});
				oListBinding.filter(oFilter);
			}

		},

		chamaAPI: function (oEvent) { // antigo onSearch

			var sPath = "/Products";
			var oParameters = {
				success: function (dados, resposta) {
					console.table(dados.results);

					for (var i = 0; i < dados.results.length; i++) {
						var oProduct = dados.results[i];

						this._list.addItem(new sap.m.StandardListItem({
							title: oProduct.ID,
							description: oProduct.Name,
							info: oProduct.Price
						}));
					}
				}.bind(this)
			};
			this._modelo.read(sPath, oParameters);

		}

	});
});