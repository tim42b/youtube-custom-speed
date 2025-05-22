import { useStorage } from "@/hooks/useStorage";
import { formatShortcut } from "@/utils/keyboardShortcut";
import {
  Box,
  Button,
  Chip,
  ChipDelete,
  FormControl,
  FormHelperText,
  Input,
  Stack,
} from "@mui/joy";
import { ChangeEvent, FormEvent, useState } from "react";

function SpeedList() {
  const [speedList, setSpeedList] = useStorage("speedList", [] as number[]);
  const [speedShortcuts, setSpeedShortcuts] = useStorage(
    "speedShortcuts",
    {} as Record<string, string>,
  );
  const [newValue, setNewValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    if (newValue === "") return;

    const valueParsed = parseFloat(newValue.replace(",", "."));

    if (isNaN(valueParsed)) {
      setError("Invalid number");
      return;
    }

    if (valueParsed < 0.0625 || valueParsed > 16) {
      setError("Value is out of range (0.0625x - 16x)");
      return;
    }

    if (speedList.includes(valueParsed)) {
      setError("Value already exists");
      return;
    }

    setSpeedList((current) =>
      [...current, valueParsed].toSorted((a, b) => a - b),
    );
    setNewValue("");
  };

  const handleDelete = (value: number) => {
    setSpeedList((current) => current.filter((speed) => speed !== value));
    setSpeedShortcuts((current) => {
      const newMap = { ...current };
      delete newMap[value];
      return newMap;
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const isValid = /^[0-9]*[,.]?[0-9]*$/.test(value);
    if (isValid) setNewValue(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAdd();
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          rowGap: 1.5,
          columnGap: 2,
          "& > :last-child": {
            marginRight: "auto",
          },
        }}
      >
        {speedList.map((speed) => (
          <Box
            key={speed}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Chip
              size="lg"
              endDecorator={<ChipDelete onDelete={() => handleDelete(speed)} />}
            >
              {`${speed}x`}
            </Chip>
            <Input
              readOnly
              placeholder="Shortcut"
              value={speedShortcuts[speed] ?? ""}
              onKeyDown={(e) => {
                e.preventDefault();
                const value = formatShortcut(e);
                setSpeedShortcuts((curr) => ({ ...curr, [speed]: value }));
              }}
              sx={{ width: 160 }}
            />
            {speedShortcuts[speed] && (
              <Button
                size="sm"
                onClick={() =>
                  setSpeedShortcuts((curr) => {
                    const map = { ...curr };
                    delete map[speed];
                    return map;
                  })
                }
              >
                Clear
              </Button>
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ alignSelf: "flex-start" }}>
        <form onSubmit={handleSubmit}>
          <FormControl error={error !== null}>
            <Input
              value={newValue ?? ""}
              autoComplete="off"
              onChange={handleChange}
              endDecorator={<Button onClick={handleAdd}>Add</Button>}
              placeholder="Add new"
              sx={{ width: 200 }}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </form>
      </Box>
    </Stack>
  );
}

export default SpeedList;
