"use client"
import {
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Stack,
    Typography,
    Divider,
    Card,
    Grid,
    Chip,
} from "@mui/joy"
import CloseIcon from "@mui/icons-material/Close"

export default function FareRulesModal({ open, onClose, fareData }) {
    if (!fareData) return null

    // Check for Hitit structure (has `remarks` array from the mapper)
    if (fareData.remarks !== undefined) {
        const remarks = fareData.remarks || [];
        return (
            <Modal open={open} onClose={onClose}>
                <ModalDialog
                    aria-labelledby="fare-modal-title"
                    size="lg"
                    sx={{
                        width: 680,
                        maxWidth: "95vw",
                        borderRadius: "md",
                        boxShadow: "lg",
                    }}
                >
                    <DialogTitle id="fare-modal-title" sx={{ pb: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography level="h2" sx={{ fontSize: "lg", fontWeight: "lg" }}>
                                    Fare Summary &amp; Rules
                                </Typography>
                                {fareData.airlineCode && (
                                    <Typography level="body-sm" sx={{ color: "neutral.500", mt: 0.25 }}>
                                        Airline: {fareData.airlineCode}
                                    </Typography>
                                )}
                            </Box>
                            <Button
                                variant="plain"
                                color="neutral"
                                size="sm"
                                onClick={onClose}
                                sx={{ borderRadius: "50%", minWidth: "auto" }}
                            >
                                <CloseIcon />
                            </Button>
                        </Box>
                    </DialogTitle>

                    <Divider sx={{ my: 1 }} />

                    <DialogContent sx={{ maxHeight: "72vh", overflowY: "auto", px: 3 }}>
                        <Stack spacing={2}>
                            <Typography
                                level="h3"
                                sx={{
                                    fontSize: "sm",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    opacity: 0.65,
                                    mb: 0.5,
                                }}
                            >
                                Fare Rules &amp; Conditions
                            </Typography>

                            {remarks.length > 0 ? (
                                remarks.map((rule, idx) => {
                                    const isPenalty = ["16", "31", "33"].includes(rule?.ruleCode);
                                    const isBaggage = rule?.ruleCode === "23";
                                    const borderColor = isPenalty
                                        ? "var(--joy-palette-warning-400, #d97706)"
                                        : isBaggage
                                            ? "var(--joy-palette-primary-400, #2563eb)"
                                            : "var(--joy-palette-neutral-300, #9ca3af)";
                                    const chipColor = isPenalty ? "warning" : isBaggage ? "primary" : "neutral";

                                    return (
                                        <Card
                                            key={idx}
                                            variant="outlined"
                                            sx={{
                                                borderLeft: `4px solid ${borderColor}`,
                                                backgroundColor: "var(--joy-palette-background-level1)",
                                                gap: 1,
                                            }}
                                        >
                                            {/* Header row: badge + title */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Chip size="sm" variant="solid" color={chipColor}>
                                                    {rule?.ruleCode || "—"}
                                                </Chip>
                                                <Typography level="body-md" sx={{ fontWeight: "bold", color: "text.primary" }}>
                                                    {rule?.title || "Rule"}
                                                </Typography>
                                            </Box>

                                            {/* Rule text */}
                                            {rule?.text && (
                                                <Typography
                                                    level="body-xs"
                                                    sx={{
                                                        whiteSpace: "pre-wrap",
                                                        lineHeight: 1.6,
                                                        color: "text.secondary",
                                                        backgroundColor: "var(--joy-palette-background-surface)",
                                                        borderRadius: "sm",
                                                        p: 1.5,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        fontFamily: "inherit",
                                                    }}
                                                >
                                                    {rule.text}
                                                </Typography>
                                            )}
                                        </Card>
                                    );
                                })
                            ) : (
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: "success.softBg",
                                        border: "1px solid",
                                        borderColor: "success.outlinedBorder",
                                        borderRadius: "md",
                                        px: 2,
                                        py: 1.5,
                                    }}
                                >
                                    <Typography level="body-sm" sx={{ fontWeight: "bold", color: "success.700" }}>
                                        ✓ No Restrictions Found
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 2 }}>
                        <Button variant="plain" color="neutral" onClick={onClose}>
                            Close
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        );
    }


    const passenger = fareData?.Summary?.PassengerDetails?.PassengerDetail
    const totalPrice = fareData?.Summary?.Total
    const baseFare = passenger?.PassengerFare?.BaseFare
    const equivFare = passenger?.PassengerFare?.EquivalentFare
    const commission = passenger?.PassengerFare?.Commission

    const getPenaltyStatus = (penalty) => {
        if (penalty.Type === "Refund") return "success"
        if (penalty.Type === "Exchange") return "warning"
        return "neutral"
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                aria-labelledby="fare-modal-title"
                size="lg"
                sx={{
                    width: 600,
                    borderRadius: "md",
                    boxShadow: "lg",
                }}
            >
                <DialogTitle id="fare-modal-title" sx={{ pb: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography level="h2" sx={{ fontSize: "lg", fontWeight: "lg" }}>
                            Fare Summary & Rules
                        </Typography>
                        <Button
                            variant="plain"
                            color="neutral"
                            size="sm"
                            onClick={onClose}
                            sx={{ borderRadius: "50%", minWidth: "auto" }}
                        >
                            <CloseIcon />
                        </Button>
                    </Box>
                </DialogTitle>

                <Divider sx={{ my: 1 }} />

                <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto", px: 3 }}>
                    <Stack spacing={3}>
                        {/* Price Summary Card */}
                        {/* <Card
                            variant="soft"
                            sx={{
                                backgroundColor: "var(--joy-palette-primary-softBg)",
                                borderLeft: "4px solid var(--joy-palette-primary-500)",
                            }}
                        >
                            <Stack spacing={1}>
                                <Typography level="body-sm" sx={{ fontWeight: "md" }}>
                                    Total Fare
                                </Typography>
                                <Typography level="h1" sx={{ fontSize: "xl", fontWeight: "bold" }}>
                                    {totalPrice.Price} {totalPrice.CurrencyCode}
                                </Typography>
                            </Stack>
                        </Card> */}

                        {/* <Divider /> */}

                        {/* Fare Breakdown */}
                        {/* <Box>
                            <Typography
                                level="h3"
                                sx={{
                                    fontSize: "md",
                                    fontWeight: "bold",
                                    mb: 1.5,
                                    textTransform: "uppercase",
                                    opacity: 0.7,
                                }}
                            >
                                Fare Breakdown
                            </Typography>

                            <Stack spacing={1}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        py: 1,
                                        px: 2,
                                        backgroundColor: "var(--joy-palette-background-level1)",
                                        borderRadius: "sm",
                                    }}
                                >
                                    <Typography level="body-sm">Base Fare</Typography>
                                    <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                                        {baseFare.Amount} {baseFare.CurrencyCode}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        py: 1,
                                        px: 2,
                                        backgroundColor: "var(--joy-palette-background-level1)",
                                        borderRadius: "sm",
                                    }}
                                >
                                    <Typography level="body-sm">Equivalent Fare</Typography>
                                    <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                                        {equivFare.Amount} {equivFare.CurrencyCode}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        py: 1,
                                        px: 2,
                                        backgroundColor: "var(--joy-palette-background-level1)",
                                        borderRadius: "sm",
                                    }}
                                >
                                    <Typography level="body-sm">Commission</Typography>
                                    <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                                        {commission.Amount} ({commission.Percentage}%)
                                    </Typography>
                                </Box>

                                {passenger.PenaltiesInfo.Taxes?.Tax && Array.isArray(passenger.PenaltiesInfo.Taxes.Tax) && (
                                    <>
                                        {passenger.PenaltiesInfo.Taxes.Tax.map((tax, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    py: 1,
                                                    px: 2,
                                                    backgroundColor: "var(--joy-palette-background-level1)",
                                                    borderRadius: "sm",
                                                }}
                                            >
                                                <Typography level="body-sm">Taxes ({tax.Code})</Typography>
                                                <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                                                    {tax.Amount} {tax.CurrencyCode}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </>
                                )}
                            </Stack>
                        </Box> */}

                        {/* <Divider /> */}

                        {/* Penalties & Conditions */}
                        <Box>
                            <Typography
                                level="h3"
                                sx={{
                                    fontSize: "md",
                                    fontWeight: "bold",
                                    mb: 1.5,
                                    textTransform: "uppercase",
                                    opacity: 0.7,
                                }}
                            >
                                Penalties & Conditions
                            </Typography>

                            <Stack spacing={1.5}>
                                {passenger.PenaltiesInfo.Penalty?.map((penalty, index) => (
                                    <Card
                                        key={index}
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: "var(--joy-palette-background-level1)",
                                            borderLeft:
                                                penalty.Type === "Refund"
                                                    ? "3px solid var(--joy-palette-success-500)"
                                                    : "3px solid var(--joy-palette-warning-500)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 1,
                                            }}
                                        >
                                            <Box>
                                                <Chip size="sm" variant="solid" color={getPenaltyStatus(penalty)}>
                                                    {penalty.Type}
                                                </Chip>
                                                <Chip size="sm" variant="soft" sx={{ ml: 1 }}>
                                                    {penalty.Applicability} Departure
                                                </Chip>
                                            </Box>
                                            {penalty.Amount && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ fontWeight: "bold", color: "var(--joy-palette-primary-500)" }}
                                                >
                                                    {penalty.Amount} {penalty.CurrencyCode}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {penalty.Changeable === "true" && (
                                                <Chip size="sm" variant="plain" color="success">
                                                    ✓ Changeable
                                                </Chip>
                                            )}
                                            {penalty.Changeable === "false" && (
                                                <Chip size="sm" variant="plain" color="danger">
                                                    ✗ Not Changeable
                                                </Chip>
                                            )}
                                            {penalty.Refundable === "true" && (
                                                <Chip size="sm" variant="plain" color="success">
                                                    ✓ Refundable
                                                </Chip>
                                            )}
                                            {penalty.Refundable === "false" && (
                                                <Chip size="sm" variant="plain" color="danger">
                                                    ✗ Not Refundable
                                                </Chip>
                                            )}
                                            {penalty.ConditionsApply === "true" && (
                                                <Chip size="sm" variant="plain" color="neutral">
                                                    ⓘ Conditions Apply
                                                </Chip>
                                            )}
                                        </Box>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 2 }}>
                    <Button variant="plain" color="neutral" onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    )
}
